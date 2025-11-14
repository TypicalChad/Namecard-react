import React, { useState, useEffect } from "react";
import { Phone, Mail, Linkedin, Globe, MapPin, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function NamecardView({ namecard, vcardContent }) {
    const [activeTab, setActiveTab] = useState("about");

    // Use namecard image if available, otherwise use company default image
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
            alert("Sharing is not supported on this device.");
        }
    };

    const handleSaveContact = () => {
        const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${namecard.name || "contact"}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full overflow-hidden">
                {/* Header */}
                <div className="relative bg-gray-50 h-48">
                    <div
                        className="absolute top-0 right-0 bg-red-600 w-full h-full"
                        style={{
                            clipPath:
                                "polygon(40% 0, 100% 0, 100% 100%, 70% 100%)",
                        }}
                    />
                    <div className="relative h-full flex items-center justify-between px-8">
                        {/* Left: Company Logo & Share */}
                        <div className="flex flex-col items-start space-y-4">
                            <div className="flex items-center space-x-2">
                                {company?.coy_logo ? (
                                    <img
                                        src={`/storage/${company.coy_logo}`}
                                        alt={company.name}
                                        className="w-20 h-20 object-contain rounded-full p-1"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                                        {company?.name?.charAt(0) || "C"}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleShare}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                            >
                                <Share2 size={24} />
                            </button>
                        </div>

                        {/* Center: Profile Image */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-8">
                            <div className="w-36 h-36 bg-white rounded-2xl border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={namecard.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: QR Code */}
                        <div className="flex items-center space-x-2">
                            <div className="w-24 h-24 bg-white p-2 rounded flex items-center justify-center">
                                <div className="w-24 h-24 bg-white p-2 rounded flex items-center justify-center">
                                    <QRCodeSVG
                                        value={vCard}
                                        size={100}
                                        level="L"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Name, Position, Department */}
                <div className="text-center pt-20 px-8">
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
                <div className="flex justify-center space-x-4 mt-6 px-8">
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
                    <div className="px-8 py-6 space-y-4">
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

                            // Strip HTML tags from value
                            const cleanValue = value
                                .replace(/<[^>]*>/g, "")
                                .replace(/&nbsp;/g, " ")
                                .trim();

                            return (
                                <div
                                    key={label}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="w-10 h-10 border-2 border-gray-800 rounded flex items-center justify-center">
                                        <Icon
                                            size={20}
                                            className="text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-blue-600 uppercase">
                                            {label}:
                                        </span>
                                        {link ? (
                                            <a
                                                href={link}
                                                target={
                                                    label === "LINKEDIN" ||
                                                    label === "WEBSITE"
                                                        ? "_blank"
                                                        : undefined
                                                }
                                                rel={
                                                    label === "LINKEDIN" ||
                                                    label === "WEBSITE"
                                                        ? "noopener noreferrer"
                                                        : undefined
                                                }
                                                className="text-gray-800 font-medium break-all hover:text-blue-600 block"
                                            >
                                                {cleanValue}
                                            </a>
                                        ) : (
                                            <div className="text-gray-800 font-medium break-all">
                                                {cleanValue}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === "services" && (
                    <div className="px-8 py-6 space-y-6">
                        <div className="border-t border-b border-red-600 py-4">
                            <h2 className="text-xl font-bold text-center">
                                SERVICES
                            </h2>
                        </div>

                        {/* Services Icons/Links */}
                        <div className="grid grid-cols-3 gap-6">
                            {/* Our Services */}
                            {company?.services && (
                                <a
                                    href={company.services}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-center hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-20 h-20 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-2">
                                        <Globe
                                            size={32}
                                            className="text-gray-800"
                                        />
                                    </div>
                                    <p className="text-sm font-medium">
                                        Our Services
                                    </p>
                                </a>
                            )}

                            {/* CBM LinkedIn */}
                            {company?.linkedin_company && (
                                <a
                                    href={company.linkedin_company}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-center hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-20 h-20 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-2">
                                        <Linkedin
                                            size={32}
                                            className="text-gray-800"
                                        />
                                    </div>
                                    <p className="text-sm font-medium">
                                        CBM LinkedIn
                                    </p>
                                </a>
                            )}

                            {/* CBM Link */}
                            {company?.cbm_link && (
                                <a
                                    href={company.cbm_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-center hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-20 h-20 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-2">
                                        <Globe
                                            size={32}
                                            className="text-gray-800"
                                        />
                                    </div>
                                    <p className="text-sm font-medium">
                                        CBM Link
                                    </p>
                                </a>
                            )}
                        </div>

                        {/* Products Section */}
                        {(company?.product_title ||
                            company?.product_image ||
                            company?.product_link) && (
                            <>
                                <div className="border-t border-b border-red-600 py-4">
                                    <h2 className="text-xl font-bold text-center">
                                        PRODUCTS
                                    </h2>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col items-center text-center mb-4">
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
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Save Contact Button */}
                <div className="px-8 pb-6">
                    <button
                        onClick={handleSaveContact}
                        className="bg-gray-800 text-white w-full py-3 rounded-lg font-bold tracking-wide hover:bg-gray-900 transition-colors"
                    >
                        SAVE CONTACT
                    </button>
                </div>

                {/* Map if exists */}
                {company.map_link && (
                    <div className="px-8 pb-6">
                        <div className="w-full overflow-hidden rounded-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.785244814512!2d103.89856917599411!3d1.303876561719776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da170f03905e01%3A0xbed188aeda875223!2sCBM%20Pte%20Ltd!5e0!3m2!1sen!2ssg!4v1762160842719!5m2!1sen!2ssg"
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

                {/* Company Banner */}
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
                                className="w-full h-auto rounded-lg hover:opacity-80 transition-opacity"
                            />
                        </a>
                    </div>
                )}

                {/* Company Subsidiaries */}
                {company?.coy_subsidiaries && (
                    <div className="px-8 pb-6">
                        <a
                            href={company.coy_subsidiaries_link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={`/storage/${company.coy_subsidiaries}`}
                                alt="Company Subsidiaries"
                                className="w-full h-auto rounded-lg hover:opacity-80 transition-opacity"
                            />
                        </a>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-6 text-center text-gray-500 text-xs">
                    Shared via Company Namecard System
                </div>
            </div>
        </div>
    );
}
