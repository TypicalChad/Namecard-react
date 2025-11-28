import React, { useState } from "react";
import {
    Phone,
    Mail,
    Linkedin,
    Globe,
    MapPin,
    Share2,
    ScanQrCode,
    MonitorCloud,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function NamecardView({ namecard, vcardContent }) {
    const [activeTab, setActiveTab] = useState("about");
    const [showQR, setShowQR] = useState(false);
    const profileUrl = `http://localhost:8000/profile/${namecard.uid}`;

    const imageUrl = namecard?.image
        ? `/storage/${namecard.image}`
        : namecard?.company?.default_image
        ? `/storage/${namecard.company.default_image}`
        : null;

    const company = namecard?.company;
    const vCard = vcardContent || "";

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${namecard.name} Contact`,
                text: "Save this contact info",
                url: window.location.href,
            });
        } else {
            alert("Sharing not supported.");
        }
    };

    const handleSaveContact = () => {
        const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${namecard.name || "contact"}.vcf`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-200 grid place-items-center p-4">
            <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full overflow-hidden">
                {/* Header */}
                <div className="relative bg-gray-50 h-48">
                    {/* Red clipped banner */}
                    <div
                        className="absolute top-0 right-0 bg-red-600 w-full h-full"
                        style={{
                            clipPath:
                                "polygon(40% 0, 100% 0, 100% 100%, 70% 100%)",
                        }}
                    />

                    <div className="grid grid-cols-[auto_1fr_auto] items-start h-full relative gap-2">
                        {/* LEFT COLUMN — Logo */}
                        <div
                            className="grid grid-cols-1 items-start left-0 adjustable-item"
                            style={{
                                paddingTop: "24px",
                                marginLeft: "20px",
                            }}
                        >
                            {/* Logo */}
                            {company?.coy_logo ? (
                                <img
                                    src={`/storage/${company.coy_logo}`}
                                    alt={company.name}
                                    className="w-20 h-18 object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-300 rounded-full grid place-items-center text-white font-bold">
                                    {company?.name?.charAt(0) || "C"}
                                </div>
                            )}
                        </div>
                        {/* LEFT COLUMN — Share */}
                        <div
                            className="absolute adjustable-item"
                            style={{ top: "120px", left: "52px" }}
                        >
                            <button
                                onClick={handleShare}
                                className="w-12 h-12 rounded-lg grid place-items-center text-gray-600 hover:text-gray-800"
                            >
                                <Share2 size={28} />
                            </button>
                        </div>

                        {/* CENTER COLUMN — Profile Picture */}
                        <div
                            className="grid place-items-center relative adjustable-item"
                            style={{ marginTop: "24px" }}
                        >
                            <div className="w-36 h-36 bg-white rounded-2xl border-4 border-white shadow-lg overflow-hidden grid place-items-center">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={namecard.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 grid place-items-center text-gray-600 font-semibold">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN — QR Button */}
                        <div
                            className="flex flex-col items-end adjustable-item"
                            style={{ paddingTop: "120px", marginRight: "52px" }}
                        >
                            <button
                                onClick={() => setShowQR(true)}
                                className="w-12 h-12 rounded-lg grid place-items-center"
                            >
                                <ScanQrCode
                                    size={28}
                                    className="text-gray-900"
                                />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Name + Position */}
                <div
                    className="grid place-items-center relative adjustable-item"
                    style={{ marginTop: "28px" }}
                >
                    <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
                        {namecard.name}
                    </h1>
                    <p className="text-sm font-semibold text-gray-700 mt-1 uppercase tracking-wide">
                        {namecard.position}
                    </p>
                    {namecard.department?.department && (
                        <p className="text-sm text-gray-600 mt-1 uppercase">
                            {namecard.department.department}
                        </p>
                    )}
                </div>

                {/* Tabs */}
                <div className="grid grid-flow-col justify-center gap-4 mt-6 px-8">
                    {["about", "services"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2 rounded font-semibold transition-colors ${
                                activeTab === tab
                                    ? "bg-gray-800 text-white"
                                    : "bg-white text-gray-800 border border-gray-300"
                            }`}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* About Tab */}
                {activeTab === "about" && (
                    <div className="px-8 py-6 grid gap-4">
                        {[
                            {
                                icon: Phone,
                                label: "CONTACT",
                                value: namecard.mobile_number,
                                link: `tel:${namecard.mobile_number}`,
                            },
                            {
                                icon: Mail,
                                label: "EMAIL",
                                value: namecard.email,
                                link: `mailto:${namecard.email}`,
                            },
                            {
                                icon: Linkedin,
                                label: "LINKEDIN",
                                value: namecard.linkedin_personal,
                                link: namecard.linkedin_personal,
                            },
                            {
                                icon: Globe,
                                label: "WEBSITE",
                                value: namecard.website || company?.website,
                                link: namecard.website || company?.website,
                            },
                            {
                                icon: MapPin,
                                label: "ADDRESS",
                                value: namecard.address || company?.address,
                                link: null,
                            },
                        ].map(({ icon: Icon, label, value, link }) => {
                            if (!value) return null;

                            const cleanValue = value
                                .replace(/<[^>]*>/g, "")
                                .replace(/&nbsp;/g, " ")
                                .trim();

                            return (
                                <div
                                    key={label}
                                    className="grid grid-cols-[50px_1fr] gap-4 items-start"
                                >
                                    <div className="w-10 h-10 border-2 border-gray-800 rounded grid place-items-center">
                                        <Icon
                                            size={20}
                                            className="text-gray-800"
                                        />
                                    </div>

                                    <div className="grid">
                                        <span className="text-xs font-bold text-blue-600 uppercase">
                                            {label}:
                                        </span>

                                        {link ? (
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-800 font-medium break-all hover:text-blue-600"
                                            >
                                                {cleanValue}
                                            </a>
                                        ) : (
                                            <p className="text-gray-800 font-medium break-all">
                                                {cleanValue}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === "services" && (
                    <div className="px-8 py-6 grid gap-6">
                        {/* SERVICES */}
                        <div className="flex items-center py-4">
                            <div className="flex-grow h-[4px] bg-red-600 rounded"></div>
                            <h2 className="px-4 text-xl font-bold text-center whitespace-nowrap">
                                SERVICES
                            </h2>
                            <div className="flex-grow h-[4px] bg-red-600 rounded"></div>
                        </div>

                        {/* Services Icons */}
                        <div className="grid grid-cols-3 gap-6">
                            {company?.services && (
                                <a
                                    href={company.services}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grid justify-items-center gap-1 hover:opacity-80"
                                >
                                    <div className="w-20 h-20 border-2 border-gray-800 rounded-lg grid place-items-center">
                                        <MonitorCloud
                                            size={40}
                                            className="text-gray-800"
                                        />
                                    </div>
                                    <p className="text-sm font-medium">
                                        Our Services
                                    </p>
                                </a>
                            )}

                            {company?.linkedin_company && (
                                <a
                                    href={company.linkedin_company}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grid justify-items-center gap-1 hover:opacity-80"
                                >
                                    <div className="w-20 h-20 border-2 border-gray-800 rounded-lg grid place-items-center">
                                        <Linkedin
                                            size={40}
                                            className="text-gray-800"
                                        />
                                    </div>
                                    <p className="text-sm font-medium">
                                        CBM LinkedIn
                                    </p>
                                </a>
                            )}

                            {company?.cbm_link && (
                                <a
                                    href={company.cbm_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grid justify-items-center gap-1 hover:opacity-80"
                                >
                                    <div className="w-20 h-20 border-2 border-gray-800 rounded-lg grid place-items-center">
                                        <Globe
                                            size={40}
                                            className="text-gray-800"
                                        />
                                    </div>
                                    <p className="text-sm font-medium">
                                        CBM Link
                                    </p>
                                </a>
                            )}
                        </div>

                        {/* Products */}
                        {(company?.product_title ||
                            company?.product_image ||
                            company?.product_link) && (
                            <>
                                {/* PRODUCTS */}
                                <div className="flex items-center py-4">
                                    <div className="flex-grow h-[4px] bg-red-600 rounded"></div>
                                    <h2 className="px-4 text-xl font-bold text-center whitespace-nowrap">
                                        PRODUCTS
                                    </h2>
                                    <div className="flex-grow h-[4px] bg-red-600 rounded"></div>
                                </div>

                                <div className="grid justify-items-center">
                                    {company.product_image && (
                                        <img
                                            src={`/storage/${company.product_image}`}
                                            alt={company.product_title}
                                            className="w-32 h-32 object-contain mb-2"
                                        />
                                    )}

                                    {company.product_link ? (
                                        <a
                                            href={company.product_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium hover:text-blue-600"
                                        >
                                            {company.product_title ||
                                                "View Product"}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-medium">
                                            {company.product_title}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Save Contact */}
                <div className="px-8 pb-6">
                    <button
                        onClick={handleSaveContact}
                        className="bg-gray-800 text-white w-full py-3 rounded-lg font-bold tracking-wide hover:bg-gray-900"
                    >
                        SAVE CONTACT
                    </button>
                </div>

                {/* Map */}
                {company?.map_link && (
                    <div className="px-8 pb-6">
                        <div className="w-full overflow-hidden rounded-lg">
                            <iframe
                                src={company.map_link}
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Banner */}
                {company?.coy_banner && (
                    <div className="px-8 pb-6">
                        <a
                            href={company.coy_banner_link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={`/storage/${company.coy_banner}`}
                                alt="Company Banner"
                                className="w-full h-auto rounded-lg hover:opacity-80"
                            />
                        </a>
                    </div>
                )}

                {/* Subsidiaries */}
                {company?.coy_subsidiaries && (
                    <div className="px-8 pb-6">
                        <a
                            href={company.coy_subsidiaries_link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={`/storage/${company.coy_subsidiaries}`}
                                alt="Subsidiaries"
                                className="w-full h-auto rounded-lg hover:opacity-80"
                            />
                        </a>
                    </div>
                )}
            </div>
            {/* QR Overlay */}
            {showQR && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowQR(false)} // Click outside closes
                >
                    <div
                        className="bg-white p-6 rounded-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <QRCodeSVG value={profileUrl} size={200} />
                    </div>
                </div>
            )}
        </div>
    );
}
