<?php

namespace App\Http\Controllers;

use App\Models\Namecard;
use App\Models\Comp;
use App\Models\Department;
use App\Helpers\RoleRedirect;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NameCardController extends Controller
{
    /**
     * PUBLIC VIEW — View namecard by UID
     */
    public function showByUid($uid)
    {
        $namecard = NameCard::with(['company', 'department'])
            ->where('uid', $uid)
            ->firstOrFail();

        return Inertia::render('Public/NamecardView', [
            'namecard' => $namecard,
            'vcardContent' => $this->generateVCardContent($namecard),
        ]);
    }

    /**
     * INDEX — List namecards with department filtering
     * Normal users = only see their own department
     * Admin = see all
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $sort = $request->get('sort', 'id');
        $dir = $request->get('dir', 'asc');

        $query = Namecard::with(['company', 'department']);

        // Restrict non-admin users
        if (strtolower($user->role->name) !== 'admin') {
            $query->where('department_id', $user->department_id);
        }

        $namecards = $query->orderBy($sort, $dir)->get();

        return Inertia::render('Admin/Namecards/Namecards', [
            'namecards' => $namecards,
            'filters' => [
                'sort' => $sort,
                'dir' => $dir,
            ],
            'breadcrumbs' => [
                ['name' => 'Dashboard', 'href' => route('admin.dashboard')],
                ['name' => 'Namecards', 'href' => null],
            ],
        ]);
    }

    /**
     * CREATE FORM
     */
    public function create()
    {
        return Inertia::render('Admin/Namecards/Create', [
            'companies' => Comp::select('id', 'name')->get(),
            'departments' => Department::select('id', 'department', 'company_id')->get(),
        ]);
    }

    /**
     * STORE NEW NAMECARD
     */
    public function store(Request $request)
    {
        $this->authorize('create', Namecard::class);

        $validated = $this->validateNamecard($request);
        $validated['uid'] = Str::uuid()->toString();
        $validated['create_user'] = Auth::user()->name ?? 'system';

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeImage($request);
        }

        $namecard = Namecard::create($validated);

        // ➤ Generate and store vCard file
        $this->storeVCardFile($namecard);

        return RoleRedirect::redirect('namecards', 'index')
            ->with('success', 'Namecard created successfully.');
    }

    /**
     * EDIT FORM
     */
    public function edit(Namecard $namecard)
    {
        return Inertia::render('Admin/Namecards/Edit', [
            'namecard' => $namecard->load(['department', 'company']),
            'companies' => Comp::select('id', 'name')->get(),
            'departments' => Department::select('id', 'department', 'company_id')->get(),
        ]);
    }

    /**
     * UPDATE NAMECARD
     */
    public function update(Request $request, Namecard $namecard)
    {
        $this->authorize('update', $namecard);

        $validated = $this->validateNamecard($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeImage($request);
        } else {
            $validated['image'] = $namecard->image;
        }

        $namecard->update($validated);

        // ➤ Regenerate vCard after update
        $this->storeVCardFile($namecard);

        return RoleRedirect::redirect('namecards', 'index')
            ->with('success', 'Namecard updated successfully.');
    }

    /**
     * DELETE NAMECARD
     */
    public function destroy(Namecard $namecard)
    {
        $this->authorize('delete', $namecard);

        if ($namecard->image) {
            Storage::disk('public')->delete($namecard->image);
        }

        $namecard->delete();

        return RoleRedirect::redirect('namecards', 'index')
            ->with('success', 'Namecard deleted successfully.');
    }

    /**
     * AJAX — Fetch departments by company
     */
    public function getDepartments($companyId)
    {
        return response()->json(
            Department::where('company_id', $companyId)
                ->select('id', 'department')
                ->get()
        );
    }

    /**
     * Helper: Validate namecard input
     */
    private function validateNamecard(Request $request)
    {
        return $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name'  => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'linkedin_personal' => 'nullable|url|max:255',
            'position' => 'nullable|string|max:255',
            'company_id' => 'nullable|exists:comps,id',
            'department_id' => 'nullable|exists:departments,id',
            'mobile_number' => 'nullable|string|max:20',
            'office_number' => 'nullable|string|max:20',
            'image' => 'nullable|file|mimes:jpg,jpeg,png|max:4096',
        ]);
    }

    /**
     * Helper: Store image in a consistent structured folder
     */
    private function storeImage(Request $request)
    {
        $folder = 'namecards/' . now()->format("M_Y");
        return $request->file('image')->store($folder, 'public');
    }

    /**
     * vCARD GENERATOR (untouched except formatting)
     */
    private function generateVCardContent($namecard)
    {
        $data = $namecard->toArray();
        $lines = [];

        $lines[] = "BEGIN:VCARD";
        $lines[] = "VERSION:3.0";

        // Name fields
        $lines[] = "N:" . ($data['last_name'] ?? '') . ";" . ($data['first_name'] ?? '') . ";;;";
        $lines[] = "FN:" . ($data['name'] ?? '');

        if (!empty($data['position'])) {
            $lines[] = "TITLE:" . $data['position'];
        }

        if (!empty($data['mobile_number'])) {
            $lines[] = "TEL;TYPE=CELL:" . $data['mobile_number'];
        }
        if (!empty($data['office_number'])) {
            $lines[] = "TEL;TYPE=WORK:" . $data['office_number'];
        }
        if (!empty($data['email'])) {
            $lines[] = "EMAIL;TYPE=WORK:" . $data['email'];
        }

        $lines[] = "END:VCARD";

        return implode("\r\n", $lines);
    }

    /**
     * Helper — Save vCard into storage/app/public/vcards/{uid}.vcf
     */
    private function storeVCardFile(Namecard $namecard)
    {
        $vcard = $this->generateVCardContent($namecard);

        $folder = 'vcards';
        $path = "$folder/{$namecard->uid}.vcf";

        Storage::disk('public')->put($path, $vcard);

        // OPTIONAL: save vcard path into DB (add `vcard_path` column if you want)
        // $namecard->update(['vcard_path' => $path]);

        return $path;
    }
}
