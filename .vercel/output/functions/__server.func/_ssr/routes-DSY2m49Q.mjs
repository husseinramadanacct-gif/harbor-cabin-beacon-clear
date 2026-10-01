import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Check, a as Printer, c as LoaderCircle, d as FileInput, f as FileDown, g as CircleAlert, h as ClipboardList, i as ShieldCheck, l as Languages, m as Copy, o as Plus, p as Download, r as Trash2, s as Minus, t as X, u as FileText } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog, u as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DSY2m49Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var HEADINGS = {
	ar: {
		summary: "الملخص المهني",
		experience: "الخبرة العملية",
		education: "المؤهلات العلمية",
		skills: "المهارات والكفاءات",
		languages: "اللغات",
		training: "الدورات التدريبية",
		interests: "الاهتمامات المهنية"
	},
	en: {
		summary: "PROFESSIONAL SUMMARY",
		experience: "PROFESSIONAL EXPERIENCE",
		education: "EDUCATION",
		skills: "SKILLS AND COMPETENCIES",
		languages: "LANGUAGES",
		training: "TRAINING AND CERTIFICATIONS",
		interests: "PROFESSIONAL INTERESTS"
	}
};
function uid() {
	return crypto.randomUUID();
}
function emptyRole() {
	return {
		id: uid(),
		title: "",
		company: "",
		start: "",
		end: "",
		bullets: [""]
	};
}
function emptyEducation() {
	return {
		id: uid(),
		degree: "",
		school: "",
		year: ""
	};
}
function emptySkillGroup(lang) {
	return {
		id: uid(),
		title: lang === "ar" ? "المهارات" : "Skills",
		items: [""]
	};
}
function emptyLanguage() {
	return {
		id: uid(),
		name: "",
		level: ""
	};
}
function emptyCv(lang) {
	return {
		id: uid(),
		lang,
		updatedAt: Date.now(),
		profile: {
			name: "",
			headline: "",
			location: "",
			phone: "",
			email: ""
		},
		summary: "",
		experience: [emptyRole()],
		education: [emptyEducation()],
		skillGroups: [emptySkillGroup(lang)],
		languages: [emptyLanguage()],
		training: [],
		interests: []
	};
}
function contactLine(cv) {
	return [
		cv.profile.email,
		cv.profile.phone,
		cv.profile.location
	].filter(Boolean).join("  |  ");
}
function dateRange(role) {
	return [role.start, role.end].filter(Boolean).join(" – ");
}
function roleYear(role) {
	const match = role.start.match(/\d{4}/);
	return match ? Number(match[0]) : 0;
}
function filledSkills(cv) {
	return cv.skillGroups.flatMap((group) => group.items.map((item) => item.trim()).filter(Boolean));
}
function filledExperience(cv) {
	return cv.experience.map((role) => ({
		...role,
		bullets: role.bullets.map((item) => item.trim()).filter(Boolean)
	})).filter((role) => role.title.trim() || role.company.trim() || role.bullets.length > 0);
}
function filledEducation(cv) {
	return cv.education.filter((item) => item.degree.trim() || item.school.trim() || item.year.trim());
}
function filledLanguages(cv) {
	return cv.languages.filter((item) => item.name.trim());
}
function filledLines(items) {
	return items.map((item) => item.trim()).filter(Boolean);
}
function displayName(cv, fallback) {
	return cv.profile.name.trim() || fallback;
}
function fileStem(cv) {
	return (cv.profile.name.trim() || (cv.lang === "ar" ? "سيرة" : "Resume")).replaceAll(/[^\p{L}\p{N}]+/gu, "_").replaceAll(/^_+|_+$/g, "").slice(0, 48) || "Resume";
}
function cloneCv(cv, lang = cv.lang) {
	return {
		...structuredClone(cv),
		id: uid(),
		lang,
		updatedAt: Date.now(),
		experience: cv.experience.map((role) => ({
			...role,
			id: uid(),
			bullets: [...role.bullets]
		})),
		education: cv.education.map((item) => ({
			...item,
			id: uid()
		})),
		skillGroups: cv.skillGroups.map((group) => ({
			...group,
			id: uid(),
			items: [...group.items]
		})),
		languages: cv.languages.map((item) => ({
			...item,
			id: uid()
		})),
		training: [...cv.training],
		interests: [...cv.interests]
	};
}
function isCvDoc(value) {
	if (!value || typeof value !== "object") return false;
	const doc = value;
	return typeof doc.id === "string" && (doc.lang === "ar" || doc.lang === "en") && !!doc.profile && typeof doc.profile.name === "string" && Array.isArray(doc.experience);
}
function buildPlainText(cv) {
	const headings = HEADINGS[cv.lang];
	const lines = [];
	lines.push(cv.profile.name);
	if (cv.profile.headline) lines.push(cv.profile.headline);
	const contact = contactLine(cv);
	if (contact) lines.push(contact);
	lines.push("");
	if (cv.summary.trim()) {
		lines.push(headings.summary);
		lines.push(cv.summary.trim());
		lines.push("");
	}
	const roles = filledExperience(cv);
	if (roles.length) {
		lines.push(headings.experience);
		for (const role of roles) {
			lines.push(`${role.title} | ${role.company} | ${dateRange(role)}`.replaceAll(" |  | ", " | "));
			for (const bullet of role.bullets) lines.push(`- ${bullet}`);
			lines.push("");
		}
	}
	const education = filledEducation(cv);
	if (education.length) {
		lines.push(headings.education);
		for (const item of education) lines.push([
			item.degree,
			item.school,
			item.year
		].filter(Boolean).join(" | "));
		lines.push("");
	}
	const groups = cv.skillGroups.filter((group) => group.title.trim() || group.items.some((item) => item.trim()));
	if (groups.length) {
		lines.push(headings.skills);
		for (const group of groups) {
			const items = group.items.map((item) => item.trim()).filter(Boolean);
			lines.push(`${group.title}: ${items.join(" | ")}`);
		}
		lines.push("");
	}
	const langs = filledLanguages(cv);
	if (langs.length) {
		lines.push(headings.languages);
		lines.push(langs.map((item) => item.level ? `${item.name} (${item.level})` : item.name).join(" | "));
		lines.push("");
	}
	const training = filledLines(cv.training);
	if (training.length) {
		lines.push(headings.training);
		lines.push(training.join(" | "));
		lines.push("");
	}
	const interests = filledLines(cv.interests);
	if (interests.length) {
		lines.push(headings.interests);
		lines.push(interests.join(" | "));
	}
	return lines.join("\n").trim();
}
function buildExportHtml(cv) {
	const dir = cv.lang === "ar" ? "rtl" : "ltr";
	const headings = HEADINGS[cv.lang];
	const roles = filledExperience(cv).map((role) => {
		const bullets = role.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
		return `<h3 style="margin:12px 0 2px;font-size:13pt;">${escapeHtml(role.title)}</h3>
<p style="margin:0 0 6px;font-size:11pt;"><b>${escapeHtml(role.company)}</b> &nbsp;|&nbsp; ${escapeHtml(dateRange(role))}</p>
<ul style="margin:0 0 8px;padding-inline-start:20px;">${bullets}</ul>`;
	}).join("");
	const education = filledEducation(cv).map((item) => `<p><b>${escapeHtml(item.degree)}</b><br/>${escapeHtml([item.school, item.year].filter(Boolean).join(" | "))}</p>`).join("");
	const skills = cv.skillGroups.filter((group) => group.items.some((item) => item.trim())).map((group) => `<p style="margin:8px 0 4px;"><b>${escapeHtml(group.title)}</b><br/>${escapeHtml(group.items.filter(Boolean).join(" | "))}</p>`).join("");
	const langs = filledLanguages(cv).map((item) => item.level ? `${item.name} (${item.level})` : item.name).join(" | ");
	const training = filledLines(cv.training).join(" | ");
	const interests = filledLines(cv.interests).join(" | ");
	return `<div dir="${dir}" style="font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.45;color:#1c1917;max-width:800px;">
<h1 style="margin:0 0 4px;font-size:22pt;">${escapeHtml(cv.profile.name)}</h1>
<p style="margin:0 0 4px;font-size:12pt;">${escapeHtml(cv.profile.headline)}</p>
<p style="margin:0 0 14px;font-size:11pt;">${escapeHtml(contactLine(cv))}</p>
${cv.summary.trim() ? `<h2 style="font-size:13pt;border-bottom:1px solid #1f6b63;padding-bottom:3px;">${escapeHtml(headings.summary)}</h2><p>${escapeHtml(cv.summary.trim())}</p>` : ""}
${roles ? `<h2 style="font-size:13pt;border-bottom:1px solid #1f6b63;padding-bottom:3px;">${escapeHtml(headings.experience)}</h2>${roles}` : ""}
${education ? `<h2 style="font-size:13pt;border-bottom:1px solid #1f6b63;padding-bottom:3px;">${escapeHtml(headings.education)}</h2>${education}` : ""}
${skills ? `<h2 style="font-size:13pt;border-bottom:1px solid #1f6b63;padding-bottom:3px;">${escapeHtml(headings.skills)}</h2>${skills}` : ""}
${langs ? `<h2 style="font-size:13pt;border-bottom:1px solid #1f6b63;padding-bottom:3px;">${escapeHtml(headings.languages)}</h2><p>${escapeHtml(langs)}</p>` : ""}
${training ? `<h2 style="font-size:13pt;border-bottom:1px solid #1f6b63;padding-bottom:3px;">${escapeHtml(headings.training)}</h2><p>${escapeHtml(training)}</p>` : ""}
${interests ? `<h2 style="font-size:13pt;border-bottom:1px solid #1f6b63;padding-bottom:3px;">${escapeHtml(headings.interests)}</h2><p>${escapeHtml(interests)}</p>` : ""}
</div>`;
}
function downloadBlob(content, filename, mime) {
	const blob = new Blob(["﻿", content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function escapeHtml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			outline: "border border-line bg-paper text-ink hover:bg-accent-soft",
			ghost: "text-ink hover:bg-accent-soft",
			secondary: "bg-ink text-paper hover:bg-ink/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var ui = {
	ar: {
		appName: "استوديو السيرة",
		tagline: "أنشئ وعدّل سيرة ATS من اللينك مباشرة",
		cvTab: "المعاينة",
		atsTab: "اختبار ATS",
		editTab: "تحرير",
		language: "English",
		printPdf: "تحميل PDF",
		downloadTxt: "تحميل TXT",
		downloadDoc: "تحميل Word",
		copyText: "نسخ النص",
		copied: "تم نسخ النص",
		copyFail: "تعذر النسخ",
		scoreTitle: "نتيجة التوافق",
		originalTitle: "سيرة بعمودين",
		originalHint: "الملفات ذات العمودين وأشرطة المهارات تسجّل عادة حوالي 40. هذه النسخة عمود واحد ونص.",
		thisVersion: "هذه السيرة",
		gradeExcellent: "ممتاز — جاهزة للإرسال",
		gradeStrong: "قوي — تعديلات بسيطة",
		gradeFair: "متوسط — يحتاج تحسين",
		gradeWeak: "ضعيف — أعد الصياغة",
		checksTitle: "فحوصات التنسيق والمحتوى",
		keywordsTitle: "الكلمات المفتاحية",
		found: "موجود",
		missing: "غير موجود",
		jdTitle: "مطابقة إعلان الوظيفة",
		jdHint: "الصق الوصف الوظيفي أو اختر نموذجًا لاختبار الكلمات المطلوبة.",
		jdPlaceholder: "الصق إعلان الوظيفة هنا…",
		runMatch: "اختبار المطابقة",
		clearJd: "مسح",
		matchScore: "نسبة التطابق",
		matched: "موجود في السيرة",
		notMatched: "ناقص — أضفه إن كان ينطبق عليك",
		parserTitle: "كيف يقرأ النظام السيرة",
		parserHint: "هذا هو النص الخام الذي تفهرسه أنظمة ATS. لا جداول ولا صور.",
		howTitle: "لماذا هذا التنسيق ينجح مع ATS؟",
		howItems: [
			"عمود واحد حتى لا يختلط ترتيب الخبرات.",
			"المهارات مكتوبة كنص بدل أشرطة ملونة لا تُقرأ.",
			"التواريخ داخل سطر الوظيفة وليس في عمود جانبي.",
			"عناوين قياسية وكلمات المجال داخل النص.",
			"أرقام إنجاز واضحة متى توفرت."
		],
		samplesLabel: "نماذج للإعلانات",
		exportHint: "حمّل PDF نصيًا (A4 أو Letter). تجنّب رفع سكانر أو ملف بعمودين.",
		pass: "نجاح",
		warn: "تحسين",
		fail: "فشل",
		coverage: "التغطية",
		pdfTitle: "أفضل تنسيقات PDF للـ ATS",
		pdfSubtitle: "ملف نصي قابل للنسخ والبحث — ليس صورة. اختر الحجم حسب سوق الوظيفة.",
		pdfClose: "إغلاق",
		pdfDownloading: "جاري إنشاء الملف…",
		pdfDone: "تم التحميل",
		pdfError: "تعذر إنشاء الملف. حاول مرة أخرى.",
		pdfPrint: "طباعة من المتصفح",
		pdfRecommended: "موصى به",
		pdfA4Title: "ATS A4",
		pdfA4Body: "الحجم القياسي في مصر والخليج وأوروبا. نص قابل للنسخ، عمود واحد، خط مضمّن.",
		pdfA4Meta: "A4 · نص حقيقي · بدون حماية",
		pdfLetterTitle: "ATS US Letter",
		pdfLetterBody: "لبوابات أمريكا وكندا: Workday وGreenhouse وLinkedIn Easy Apply.",
		pdfLetterMeta: "Letter 8.5×11 · نص حقيقي · بدون حماية",
		pdfStrictTitle: "أقصى توافق",
		pdfStrictBody: "أسود بالكامل بدون خطوط زخرفية. لأقدم أنظمة التتبع التي تتعثر في الألوان.",
		pdfStrictMeta: "بدون زخرفة · خط قياسي للإنجليزية",
		pdfDownload: "تحميل",
		pdfWhyTitle: "لماذا هذا الـ PDF؟",
		pdfWhyItems: [
			"النص قابل للنسخ والبحث — ATS لا يقرأ PDF الصورة أو السكانر.",
			"عمود واحد بترتيب منطقي.",
			"A4 للسوق المحلي والأوروبي، وUS Letter للوظائف الأمريكية.",
			"بدون جداول أو أشرطة مهارات أو صورة شخصية أو كلمة مرور."
		],
		pdfPanelTitle: "تنسيقات PDF",
		pdfPanelHint: "اختر ملفًا حسب سوق الوظيفة. الثلاثة نصية وجاهزة للرفع.",
		newCv: "سيرة جديدة",
		sampleCv: "نموذج محاسب",
		duplicateCv: "نسخة",
		deleteCv: "حذف",
		saved: "يُحفظ تلقائيًا على هذا الجهاز",
		cvLang: "لغة السيرة",
		cvLangAr: "عربي",
		cvLangEn: "English",
		sectionProfile: "البيانات الأساسية",
		name: "الاسم",
		headline: "المسمى الوظيفي",
		location: "المدينة",
		phone: "الهاتف",
		email: "البريد",
		sectionSummary: "الملخص المهني",
		sectionExperience: "الخبرة العملية",
		addJob: "إضافة وظيفة",
		removeJob: "حذف الوظيفة",
		jobTitle: "المسمى",
		company: "الجهة",
		start: "من",
		end: "إلى",
		currentJob: "الوظيفة الحالية",
		bullets: "المهام والإنجازات — سطر لكل بند",
		addBullet: "بند",
		sectionEducation: "المؤهلات",
		addEducation: "إضافة مؤهل",
		degree: "المؤهل",
		school: "الجامعة / الجهة",
		year: "السنة",
		sectionSkills: "المهارات",
		addSkillGroup: "مجموعة مهارات",
		groupTitle: "عنوان المجموعة",
		skillItems: "المهارات — سطر لكل مهارة",
		sectionLanguages: "اللغات",
		addLanguage: "إضافة لغة",
		langName: "اللغة",
		langLevel: "المستوى",
		sectionTraining: "الدورات — سطر لكل دورة",
		sectionInterests: "الاهتمامات — سطر لكل بند",
		exportJson: "تصدير نسخة",
		importJson: "استيراد",
		pickCv: "السير المحفوظة",
		emptyPreview: "ابدأ من التحرير على اليمين. المعاينة تتحدث فور الكتابة."
	},
	en: {
		appName: "Resume Studio",
		tagline: "Create and edit an ATS resume from the link",
		cvTab: "Preview",
		atsTab: "ATS test",
		editTab: "Edit",
		language: "العربية",
		printPdf: "Download PDF",
		downloadTxt: "Download TXT",
		downloadDoc: "Download Word",
		copyText: "Copy text",
		copied: "Text copied",
		copyFail: "Could not copy",
		scoreTitle: "Compatibility score",
		originalTitle: "Two-column file",
		originalHint: "Two-column files with skill bars often score around 40. This version is one column of real text.",
		thisVersion: "This resume",
		gradeExcellent: "Excellent — ready to submit",
		gradeStrong: "Strong — minor edits",
		gradeFair: "Fair — needs work",
		gradeWeak: "Weak — rewrite",
		checksTitle: "Format and content checks",
		keywordsTitle: "Keywords",
		found: "Found",
		missing: "Missing",
		jdTitle: "Job description match",
		jdHint: "Paste a job ad or pick a sample to test required keywords.",
		jdPlaceholder: "Paste the job description here…",
		runMatch: "Run match",
		clearJd: "Clear",
		matchScore: "Match rate",
		matched: "Present in the resume",
		notMatched: "Missing — add only if it is true",
		parserTitle: "How ATS reads this resume",
		parserHint: "This is the raw text parsers index. No tables, no images.",
		howTitle: "Why this layout works with ATS",
		howItems: [
			"Single column so experience order stays intact.",
			"Skills written as text instead of unread graphic bars.",
			"Dates sit on the job line, not in a side rail.",
			"Standard headings and field keywords in the body.",
			"Clear metrics whenever you have them."
		],
		samplesLabel: "Sample job ads",
		exportHint: "Download a text-based PDF (A4 or Letter). Avoid scans and two-column files.",
		pass: "Pass",
		warn: "Improve",
		fail: "Fail",
		coverage: "Coverage",
		pdfTitle: "Best ATS PDF formats",
		pdfSubtitle: "Selectable, searchable text — not an image. Pick the page size for the job market.",
		pdfClose: "Close",
		pdfDownloading: "Building the file…",
		pdfDone: "Downloaded",
		pdfError: "Could not build the file. Try again.",
		pdfPrint: "Print from browser",
		pdfRecommended: "Recommended",
		pdfA4Title: "ATS A4",
		pdfA4Body: "Standard size for Egypt, the Gulf, and Europe. Selectable text, one column, embedded font.",
		pdfA4Meta: "A4 · real text · unlocked",
		pdfLetterTitle: "ATS US Letter",
		pdfLetterBody: "For US and Canada boards: Workday, Greenhouse, LinkedIn Easy Apply.",
		pdfLetterMeta: "Letter 8.5×11 · real text · unlocked",
		pdfStrictTitle: "Maximum parse",
		pdfStrictBody: "All-black, no decorative rules. For older ATS tools that stumble on color.",
		pdfStrictMeta: "No chrome · standard font for English",
		pdfDownload: "Download",
		pdfWhyTitle: "Why this PDF?",
		pdfWhyItems: [
			"Text is selectable and searchable — ATS cannot read a scanned or image PDF.",
			"One column in logical order.",
			"A4 for local and European roles, US Letter for American postings.",
			"No tables, skill bars, photo, or password."
		],
		pdfPanelTitle: "PDF formats",
		pdfPanelHint: "Pick a file for the job market. All three are text-based and upload-ready.",
		newCv: "New resume",
		sampleCv: "Accountant sample",
		duplicateCv: "Duplicate",
		deleteCv: "Delete",
		saved: "Saves automatically on this device",
		cvLang: "Resume language",
		cvLangAr: "Arabic",
		cvLangEn: "English",
		sectionProfile: "Basics",
		name: "Name",
		headline: "Headline",
		location: "City",
		phone: "Phone",
		email: "Email",
		sectionSummary: "Professional summary",
		sectionExperience: "Experience",
		addJob: "Add role",
		removeJob: "Remove role",
		jobTitle: "Title",
		company: "Company",
		start: "From",
		end: "To",
		currentJob: "Current role",
		bullets: "Duties and results — one per line",
		addBullet: "Bullet",
		sectionEducation: "Education",
		addEducation: "Add education",
		degree: "Degree",
		school: "School",
		year: "Year",
		sectionSkills: "Skills",
		addSkillGroup: "Skill group",
		groupTitle: "Group title",
		skillItems: "Skills — one per line",
		sectionLanguages: "Languages",
		addLanguage: "Add language",
		langName: "Language",
		langLevel: "Level",
		sectionTraining: "Training — one per line",
		sectionInterests: "Interests — one per line",
		exportJson: "Export backup",
		importJson: "Import",
		pickCv: "Saved resumes",
		emptyPreview: "Start in the editor. The preview updates as you type."
	}
};
function t(lang) {
	return ui[lang];
}
function PdfExportButton({ cv, uiLang }) {
	const copy = t(uiLang);
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (next) => {
			setOpen(next);
			if (next) {
				import("./pdf-build-DUROtLLT.mjs");
				if (cv.lang === "ar") {
					fetch("/fonts/IBMPlexSansArabic-Regular.ttf");
					fetch("/fonts/IBMPlexSansArabic-SemiBold.ttf");
				}
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, {}), copy.printPdf]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "no-print fixed inset-0 z-40 bg-ink/45" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: cn("no-print fixed inset-x-0 bottom-0 z-50 max-h-dvh overflow-y-auto rounded-t-xl bg-bg-elevated p-5 shadow-paper", "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-base font-semibold text-ink",
						children: copy.pdfTitle
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "mt-1 text-sm leading-relaxed text-muted",
						children: copy.pdfSubtitle
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							"aria-label": copy.pdfClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfFormatList, {
					cv,
					uiLang,
					className: "mt-4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), copy.pdfPrint]
					})
				})
			]
		})] })]
	});
}
function PdfFormatList({ cv, uiLang, className }) {
	const copy = t(uiLang);
	const [status, setStatus] = (0, import_react.useState)({
		a4: "idle",
		letter: "idle",
		strict: "idle"
	});
	async function onDownload(id) {
		setStatus((prev) => ({
			...prev,
			[id]: "busy"
		}));
		try {
			const { buildCvPdf, downloadPdf, pdfFilename } = await import("./pdf-build-DUROtLLT.mjs");
			downloadPdf(await buildCvPdf(cv, id), pdfFilename(cv, id));
			setStatus((prev) => ({
				...prev,
				[id]: "done"
			}));
			window.setTimeout(() => {
				setStatus((prev) => ({
					...prev,
					[id]: prev[id] === "done" ? "idle" : prev[id]
				}));
			}, 1800);
		} catch {
			setStatus((prev) => ({
				...prev,
				[id]: "error"
			}));
		}
	}
	const cards = [
		{
			id: "a4",
			title: copy.pdfA4Title,
			body: copy.pdfA4Body,
			meta: copy.pdfA4Meta,
			recommended: cv.lang === "ar"
		},
		{
			id: "letter",
			title: copy.pdfLetterTitle,
			body: copy.pdfLetterBody,
			meta: copy.pdfLetterMeta,
			recommended: cv.lang === "en"
		},
		{
			id: "strict",
			title: copy.pdfStrictTitle,
			body: copy.pdfStrictBody,
			meta: copy.pdfStrictMeta,
			recommended: false
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-3", className),
		children: cards.map((card) => {
			const state = status[card.id];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: cn("rounded-md border bg-paper p-4", card.recommended ? "border-accent" : "border-line"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-start justify-between gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold text-ink",
								children: card.title
							}), card.recommended ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent",
								children: copy.pdfRecommended
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted",
							children: card.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-subtle",
							children: card.meta
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					className: "mt-3",
					variant: card.recommended ? "default" : "outline",
					disabled: state === "busy",
					onClick: () => void onDownload(card.id),
					children: [state === "busy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : state === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), state === "busy" ? copy.pdfDownloading : state === "done" ? copy.pdfDone : state === "error" ? copy.pdfError : copy.pdfDownload]
				})]
			}, card.id);
		})
	});
}
var ACCOUNTING_KEYWORDS = {
	en: [
		"general ledger",
		"treasury",
		"accounts payable",
		"accounts receivable",
		"payroll",
		"inventory",
		"month-end",
		"reconciliation",
		"trial balance",
		"excel",
		"power query",
		"erp",
		"cost accounting",
		"cash flow",
		"internal control",
		"financial reporting",
		"vat",
		"pricing",
		"chart of accounts",
		"journal",
		"xlookup",
		"pivot"
	],
	ar: [
		"الأستاذ العام",
		"الخزينة",
		"الحسابات الدائنة",
		"الحسابات المدينة",
		"الرواتب",
		"المخزون",
		"الإقفال الشهري",
		"تسويات",
		"ميزان المراجعة",
		"excel",
		"power query",
		"erp",
		"التكاليف",
		"التدفقات النقدية",
		"الرقابة الداخلية",
		"التقارير المالية",
		"ضريبة القيمة المضافة",
		"دليل الحسابات",
		"القيود"
	]
};
var STOPWORDS_EN = /* @__PURE__ */ new Set([
	"the",
	"and",
	"for",
	"with",
	"that",
	"this",
	"from",
	"your",
	"you",
	"are",
	"was",
	"were",
	"will",
	"have",
	"has",
	"had",
	"not",
	"but",
	"all",
	"any",
	"our",
	"their",
	"they",
	"who",
	"job",
	"role",
	"work",
	"ability",
	"skills",
	"experience",
	"required",
	"requirements",
	"including",
	"include",
	"plus",
	"must",
	"should",
	"able",
	"using",
	"into",
	"over",
	"under",
	"about",
	"such",
	"other",
	"than",
	"also",
	"well",
	"good",
	"strong",
	"team",
	"years",
	"hiring",
	"hire",
	"looking",
	"candidate",
	"position",
	"responsibilities",
	"prepare",
	"own",
	"full",
	"close",
	"working",
	"pressure",
	"across",
	"within",
	"through",
	"support",
	"supports",
	"make",
	"making",
	"decision"
]);
var STOPWORDS_AR = /* @__PURE__ */ new Set([
	"في",
	"من",
	"على",
	"إلى",
	"عن",
	"مع",
	"هذا",
	"هذه",
	"ذلك",
	"التي",
	"الذي",
	"أو",
	"و",
	"أن",
	"إن",
	"كان",
	"يكون",
	"يتم",
	"مطلوب",
	"وظيفة",
	"خبرة",
	"لديه",
	"لديك",
	"القدرة",
	"العمل",
	"شركة",
	"بين",
	"بعد",
	"قبل",
	"خلال",
	"حيث",
	"كما",
	"بما",
	"عند",
	"حتى"
]);
var SAMPLE_JOBS = {
	ar: [
		{
			id: "fin-acc",
			title: "محاسب مالي",
			text: "مطلوب محاسب مالي لإدارة الدورة المحاسبية الكاملة بما يشمل الأستاذ العام، الخزينة، الحسابات الدائنة والمدينة، الرواتب، المخزون، والإقفال الشهري. إعداد تسويات الحسابات وميزان المراجعة والتقارير المالية. خبرة في Excel المتقدم وPower Query وPower BI وOdoo ERP. القدرة على تحليل التكاليف والرقابة الداخلية والعمل تحت الضغط."
		},
		{
			id: "cost",
			title: "محاسب تكاليف",
			text: "محاسب تكاليف لمتابعة تكلفة الإنتاج، توزيع المصروفات على مراكز التكلفة، مراجعة حركة المخزون، وتحليل هامش الربحية. خبرة في التصنيع، التسعير، المشتريات، والتقارير الإدارية. استخدام Excel وERP وPower BI."
		},
		{
			id: "payroll",
			title: "محاسب رواتب",
			text: "محاسب رواتب لمراجعة كشوف الرواتب، الاستحقاقات والخصومات، الحضور والانصراف، وصرف الرواتب في المواعيد المحددة. متابعة التسويات الشهرية والحسابات الدائنة. إتقان Excel وأنظمة ERP."
		}
	],
	en: [
		{
			id: "fin-acc",
			title: "Financial Accountant",
			text: "We are hiring a Financial Accountant to own the full accounting cycle including General Ledger, Treasury, Accounts Payable, Accounts Receivable, payroll, inventory, and month-end close. Prepare account reconciliations, trial balance, and financial reports. Advanced Excel, Power Query, Power BI, and Odoo ERP required. Experience in cost analysis, internal controls, and working under pressure."
		},
		{
			id: "cost",
			title: "Cost Accountant",
			text: "Cost Accountant to track production costing, allocate expenses to cost centers, review inventory movement, and analyze profit margins. Manufacturing, pricing, procurement, and management reporting experience. Excel, ERP, and Power BI."
		},
		{
			id: "payroll",
			title: "Payroll Accountant",
			text: "Payroll Accountant to review payroll files, entitlements and deductions, attendance, and on-time salary payment. Monthly settlements and accounts payable follow-up. Strong Excel and ERP systems."
		}
	]
};
var CHECK_COPY = {
	ar: {
		column: {
			label: "عمود واحد بدون جداول",
			pass: "التخطيط عمود واحد قابل للقراءة من أنظمة ATS. النسخة الأصلية كانت بعمودين وهذا يخلط النص.",
			fail: "التخطيط متعدد الأعمدة أو يحتوي جداول."
		},
		headings: {
			label: "عناوين أقسام قياسية",
			pass: "العناوين قياسية: ملخص، خبرات، تعليم، مهارات، لغات.",
			fail: "العناوين غير قياسية وقد تتجاهلها الأنظمة."
		},
		contact: {
			label: "بيانات التواصل داخل النص",
			pass: "البريد والهاتف والموقع مكتوبة كنص في رأس السيرة وليس داخل صورة أو تذييل.",
			fail: "بيانات التواصل ناقصة أو داخل صورة."
		},
		dates: {
			label: "تواريخ واضحة بترتيب زمني عكسي",
			pass: "كل وظيفة لها سنة بداية ونهاية، مرتبة من الأحدث للأقدم.",
			fail: "تواريخ ناقصة أو ترتيب غير زمني."
		},
		skills_text: {
			label: "مهارات كنص وليس أشرطة",
			pass: "المهارات مكتوبة كنص يمكن فهرسته. أشرطة المستوى في النسخة الأصلية لا تُقرأ.",
			fail: "المهارات معروضة كرسوم أو أشرطة فقط."
		},
		quantified: {
			label: "إنجازات رقمية",
			pass: "يوجد إنجازات مرقمة داخل بنود الخبرة.",
			warn: "أضف أرقامًا (قيمة، عدد، نسبة) لتقوية الأثر.",
			fail: "لا توجد أرقام قابلة للقياس في البنود."
		},
		keywords: {
			label: "كلمات مفتاحية للمجال",
			pass: "كلمات المجال ظاهرة في النص ويمكن فهرستها.",
			fail: "كلمات المجال ضعيفة — أضف مصطلحات الوظيفة في الملخص والمهارات.",
			warn: "تغطية الكلمات جيدة مع بعض الفجوات."
		},
		length: {
			label: "طول مناسب (صفحة إلى صفحتين)",
			pass: "الطول مناسب لأنظمة التتبع ومديري التوظيف.",
			fail: "السيرة قصيرة جدًا أو أطول من اللازم."
		},
		no_photo: {
			label: "بدون صورة شخصية",
			pass: "لا توجد صورة — أفضل لـ ATS ولتجنب التحيز.",
			fail: "وجود صورة يربك بعض الأنظمة."
		},
		verbs: {
			label: "أفعال إنجاز واضحة",
			pass: "البنود تبدأ بأفعال تشغيلية: إدارة، مراجعة، إعداد، متابعة.",
			fail: "البنود وصفية بدون أفعال إنجاز."
		}
	},
	en: {
		column: {
			label: "Single column, no tables",
			pass: "Single-column layout that ATS parsers can read in order. The original two-column file would scramble the text.",
			fail: "Multi-column or table layout."
		},
		headings: {
			label: "Standard section headings",
			pass: "Standard headings: Summary, Experience, Education, Skills, Languages.",
			fail: "Non-standard headings that parsers may skip."
		},
		contact: {
			label: "Contact details as real text",
			pass: "Email, phone, and location sit in the document body, not in an image or footer.",
			fail: "Contact details missing or embedded in an image."
		},
		dates: {
			label: "Clear reverse-chronological dates",
			pass: "Every role has a start and end year, newest first.",
			fail: "Missing dates or mixed order."
		},
		skills_text: {
			label: "Skills as text, not bars",
			pass: "Skills are written as text so they can be indexed. Graphic skill bars in the original are invisible to ATS.",
			fail: "Skills shown only as graphics."
		},
		quantified: {
			label: "Quantified achievements",
			pass: "Measurable results are present in the bullets.",
			warn: "Add numbers (value, count, percent) to strengthen impact.",
			fail: "No measurable numbers in the bullets."
		},
		keywords: {
			label: "Field keywords",
			pass: "Field terms appear in the text and can be indexed.",
			fail: "Field keyword coverage is weak — add job terms in the summary and skills.",
			warn: "Good coverage with a few gaps."
		},
		length: {
			label: "Length (1–2 pages)",
			pass: "Length is appropriate for ATS and recruiters.",
			fail: "Resume is too short or too long."
		},
		no_photo: {
			label: "No photo",
			pass: "No headshot — better for ATS and bias-safe screening.",
			fail: "A photo can break some parsers."
		},
		verbs: {
			label: "Action-led bullets",
			pass: "Bullets start with operating verbs: manage, review, prepare, track.",
			fail: "Bullets are descriptive without action verbs."
		}
	}
};
function runAts(cv, jobDescription = "") {
	const lang = cv.lang;
	const text = buildPlainText(cv);
	const lower = text.toLowerCase();
	const copy = CHECK_COPY[lang];
	const roles = filledExperience(cv);
	const skills = filledSkills(cv);
	const emailOk = /@/.test(cv.profile.email);
	const phoneOk = /\+?\d[\d\s]{8,}/.test(cv.profile.phone);
	const numberedBullets = roles.flatMap((r) => r.bullets).filter((b) => /\d/.test(b)).length;
	const keywordList = ACCOUNTING_KEYWORDS[lang];
	const keywordHits = keywordList.map((term) => ({
		term,
		found: lower.includes(term.toLowerCase())
	}));
	const foundCount = keywordHits.filter((k) => k.found).length;
	const keywordCoverage = keywordList.length ? Math.round(foundCount / keywordList.length * 100) : 0;
	const datesOk = roles.length > 0 && roles.every((r) => r.start && r.end);
	const reverseOk = roles.length === 0 || (roleYear(roles[roles.length - 1]) || 0) <= (roleYear(roles[0]) || 9999);
	const wordCount = text.split(/\s+/).filter(Boolean).length;
	const lengthOk = wordCount >= 250 && wordCount <= 1400;
	const verbHits = (lang === "ar" ? [
		"إدارة",
		"مراجعة",
		"إعداد",
		"متابعة",
		"تسجيل",
		"تأسيس",
		"تحليل",
		"تنظيم"
	] : [
		"manage",
		"review",
		"prepare",
		"track",
		"record",
		"found",
		"analy",
		"lead"
	]).filter((v) => lower.includes(v.toLowerCase())).length;
	const checks = [
		makeCheck("column", copy.column, "pass", 14),
		makeCheck("headings", copy.headings, "pass", 12),
		makeCheck("contact", copy.contact, emailOk && phoneOk && cv.profile.location.trim() ? "pass" : "fail", 10),
		makeCheck("dates", copy.dates, datesOk && reverseOk ? "pass" : "fail", 10),
		makeCheck("skills_text", copy.skills_text, skills.length >= 5 ? "pass" : skills.length >= 2 ? "warn" : "fail", 10),
		makeCheck("quantified", copy.quantified, numberedBullets >= 4 ? "pass" : numberedBullets >= 2 ? "warn" : "fail", 12),
		makeCheck("keywords", copy.keywords, keywordCoverage >= 50 ? "pass" : keywordCoverage >= 25 ? "warn" : "fail", 12),
		makeCheck("length", copy.length, lengthOk ? "pass" : "warn", 8),
		makeCheck("no_photo", copy.no_photo, "pass", 6),
		makeCheck("verbs", copy.verbs, verbHits >= 4 ? "pass" : "warn", 6)
	];
	const score = scoreChecks(checks);
	let jdCoverage = null;
	let jdMatched = [];
	let jdMissing = [];
	const jd = jobDescription.trim();
	if (jd) {
		const terms = extractJdTerms(jd, lang);
		const cvHaystack = lower + " " + cv.summary.toLowerCase();
		for (const term of terms) if (cvHaystack.includes(term.toLowerCase())) jdMatched.push(term);
		else jdMissing.push(term);
		jdCoverage = terms.length ? Math.round(jdMatched.length / terms.length * 100) : 0;
	}
	return {
		score,
		grade: score >= 90 ? "excellent" : score >= 75 ? "strong" : score >= 55 ? "fair" : "weak",
		checks,
		keywordHits,
		keywordCoverage,
		jdCoverage,
		jdMatched,
		jdMissing,
		parserPreview: text || (lang === "ar" ? "أضف بيانات السيرة ليظهر النص الذي يقرأه النظام." : "Add resume content to see parser text."),
		originalScore: 41
	};
}
function makeCheck(id, copy, status, weight) {
	const detail = status === "pass" ? copy.pass : status === "warn" ? copy.warn ?? copy.pass : copy.fail;
	return {
		id,
		label: copy.label,
		status,
		weight,
		detail
	};
}
function scoreChecks(checks) {
	const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
	const earned = checks.reduce((n, c) => {
		const factor = c.status === "pass" ? 1 : c.status === "warn" ? .55 : 0;
		return n + c.weight * factor;
	}, 0);
	return Math.round(earned / totalWeight * 100);
}
function extractJdTerms(jd, lang) {
	const foundKnown = ACCOUNTING_KEYWORDS[lang].filter((k) => jd.toLowerCase().includes(k.toLowerCase()));
	const extras = tokenize(jd, lang).filter((t) => t.length >= 5).filter((t) => isSkillLike(t)).filter((t) => !foundKnown.some((k) => k.toLowerCase().includes(t) || t.includes(k.toLowerCase()))).slice(0, 8);
	return unique([...foundKnown, ...extras]).slice(0, 18);
}
var SKILL_HINTS = /* @__PURE__ */ new Set([
	"ifrs",
	"gaap",
	"sap",
	"oracle",
	"quickbooks",
	"tally",
	"hyperion",
	"netsuite",
	"dynamics",
	"python",
	"budget",
	"forecast",
	"audit",
	"vat",
	"costing",
	"reconciliation",
	"reconciliations",
	"payroll",
	"treasury",
	"inventory",
	"odoo",
	"excel",
	"tableau"
]);
function isSkillLike(token) {
	if (SKILL_HINTS.has(token)) return true;
	if (/\d/.test(token)) return false;
	return token.length >= 7 && !token.endsWith("ing") && !token.endsWith("ed");
}
function tokenize(text, lang) {
	const parts = text.toLowerCase().split(/[^\p{L}\p{N}+#]+/u).map((t) => t.trim()).filter(Boolean);
	const stop = lang === "ar" ? STOPWORDS_AR : STOPWORDS_EN;
	const counts = /* @__PURE__ */ new Map();
	for (const p of parts) {
		if (stop.has(p) || /^\d+$/.test(p) || p.length < 4) continue;
		counts.set(p, (counts.get(p) ?? 0) + 1);
	}
	return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}
function unique(items) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const item of items) {
		const key = item.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(item);
	}
	return out;
}
function AtsPanel({ cv, uiLang }) {
	const copy = t(uiLang);
	const [jd, setJd] = (0, import_react.useState)("");
	const [activeSample, setActiveSample] = (0, import_react.useState)(null);
	const report = (0, import_react.useMemo)(() => runAts(cv, jd), [cv, jd]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex min-w-0 flex-col gap-5 overflow-x-clip",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
				lang: uiLang,
				score: report.score,
				original: report.originalScore,
				grade: report.grade
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold text-ink",
				children: copy.howTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: copy.howItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2 text-sm leading-relaxed text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						className: "mt-0.5 size-4 shrink-0 text-accent",
						strokeWidth: 2
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
				}, item))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-ink",
					children: copy.pdfPanelTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: copy.pdfPanelHint
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfFormatList, {
					cv,
					uiLang,
					className: "mt-4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs font-medium text-ink",
					children: copy.pdfWhyTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: copy.pdfWhyItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2 text-sm leading-relaxed text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "mt-0.5 size-4 shrink-0 text-accent",
							strokeWidth: 2
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
					}, item))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold text-ink",
				children: copy.checksTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3",
				children: report.checks.map((check) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRow, {
					check,
					lang: uiLang
				}, check.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-ink",
					children: copy.keywordsTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium text-muted",
					children: [
						copy.coverage,
						" ",
						report.keywordCoverage,
						"%"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-1.5 overflow-hidden",
				children: report.keywordHits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("max-w-full rounded-full px-2.5 py-1 text-xs font-medium break-words", hit.found ? "bg-accent-soft text-accent" : "bg-score-track text-subtle"),
					children: hit.term
				}, hit.term))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-ink",
					children: copy.jdTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: copy.jdHint
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs font-medium uppercase tracking-wide text-subtle",
					children: copy.samplesLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: SAMPLE_JOBS[cv.lang].map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: activeSample === sample.id ? "default" : "outline",
						onClick: () => {
							setActiveSample(sample.id);
							setJd(sample.text);
						},
						children: sample.title
					}, sample.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: jd,
					onChange: (event) => {
						setJd(event.target.value);
						setActiveSample(null);
					},
					rows: 6,
					className: "mt-3 w-full resize-y rounded-md border border-line bg-paper px-3 py-3 text-sm text-ink outline-none transition-[box-shadow] duration-150 placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40",
					placeholder: copy.jdPlaceholder
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: "ghost",
						onClick: () => {
							setJd("");
							setActiveSample(null);
						},
						children: copy.clearJd
					})
				}),
				report.jdCoverage !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-md bg-accent-soft p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-ink",
							children: copy.matchScore
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-2xl font-semibold tabular-nums text-accent",
							children: [report.jdCoverage, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeywordList, {
							title: copy.matched,
							items: report.jdMatched,
							tone: "ok"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeywordList, {
							title: copy.notMatched,
							items: report.jdMissing,
							tone: "miss"
						})]
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-ink",
						children: copy.parserTitle
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: copy.parserHint
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-sm bg-ink px-3 py-3 text-xs leading-relaxed text-paper",
					children: report.parserPreview
				})
			] })
		]
	});
}
function ScoreCard({ lang, score, original, grade }) {
	const copy = t(lang);
	const gradeLabel = {
		excellent: copy.gradeExcellent,
		strong: copy.gradeStrong,
		fair: copy.gradeFair,
		weak: copy.gradeWeak
	}[grade];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.14em] text-subtle",
					children: copy.scoreTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium text-ink",
					children: gradeLabel
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-accent" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, {
					label: copy.thisVersion,
					value: score,
					accent: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, {
					label: copy.originalTitle,
					value: original
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted",
				children: copy.originalHint
			})
		]
	});
}
function ScoreGauge({ label, value, accent }) {
	const radius = 34;
	const circ = 2 * Math.PI * radius;
	const offset = circ - value / 100 * circ;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: "84",
			height: "84",
			viewBox: "0 0 84 84",
			className: "shrink-0",
			"aria-hidden": true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "42",
				cy: "42",
				r: radius,
				fill: "none",
				stroke: "var(--color-score-track)",
				strokeWidth: "7"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				className: "score-ring",
				cx: "42",
				cy: "42",
				r: radius,
				fill: "none",
				stroke: accent ? "var(--color-accent)" : "var(--color-warn)",
				strokeWidth: "7",
				strokeLinecap: "round",
				strokeDasharray: circ,
				strokeDashoffset: offset
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-3xl font-semibold tabular-nums leading-none text-ink",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted",
			children: label
		})] })]
	});
}
function CheckRow({ check, lang }) {
	const copy = t(lang);
	const Icon = check.status === "pass" ? Check : check.status === "warn" ? CircleAlert : Minus;
	const tone = check.status === "pass" ? "text-success" : check.status === "warn" ? "text-warn" : "text-danger";
	const badge = check.status === "pass" ? copy.pass : check.status === "warn" ? copy.warn : copy.fail;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "rounded-sm bg-bg px-3 py-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: cn("mt-0.5 size-4 shrink-0", tone),
					strokeWidth: 2
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-ink",
					children: check.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs leading-relaxed text-muted",
					children: check.detail
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("shrink-0 text-xs font-medium", tone),
				children: badge
			})]
		})
	});
}
function KeywordList({ title, items, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-semibold text-ink",
		children: title
	}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-xs text-muted",
		children: "—"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 flex flex-wrap gap-1.5",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("rounded-full px-2 py-1 text-xs", tone === "ok" ? "bg-paper text-success" : "bg-paper text-warn"),
			children: item
		}, item))
	})] });
}
function Panel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-lg bg-bg-elevated p-5 shadow-panel", className),
		children
	});
}
function CvDocument({ cv }) {
	const lang = cv.lang;
	const headings = HEADINGS[lang];
	const roles = filledExperience(cv);
	const education = filledEducation(cv);
	const langs = filledLanguages(cv);
	const training = filledLines(cv.training);
	const interests = filledLines(cv.interests);
	const groups = cv.skillGroups.filter((group) => group.items.some((item) => item.trim()));
	const name = cv.profile.name.trim() || (lang === "ar" ? "اسمك هنا" : "Your name");
	const contact = contactLine(cv);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: "cv-document",
		className: "cv-page mx-auto w-full max-w-4xl text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl",
						children: name
					}),
					cv.profile.headline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium text-accent sm:text-base",
						children: cv.profile.headline
					}) : null,
					contact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: contact
					}) : null
				]
			}),
			cv.summary.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvSection, {
				lang,
				title: headings.summary,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-ink",
					children: cv.summary.trim()
				})
			}) : null,
			roles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvSection, {
				lang,
				title: headings.experience,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-5",
					children: roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-semibold text-ink",
						children: [
							role.title,
							role.company ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-normal text-muted",
								children: [" — ", role.company]
							}) : null,
							dateRange(role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium text-muted",
								children: [" · ", dateRange(role)]
							}) : null
						]
					}), role.bullets.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 list-disc space-y-1 ps-5 text-sm leading-relaxed text-ink",
						children: role.bullets.map((bullet) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: bullet }, bullet))
					}) : null] }, role.id))
				})
			}) : null,
			education.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvSection, {
				lang,
				title: headings.education,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: education.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: item.degree || item.school
							}),
							item.school && item.degree ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" — ", item.school]
							}) : null,
							item.year ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium text-muted",
								children: [" · ", item.year]
							}) : null
						]
					}, item.id))
				})
			}) : null,
			groups.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvSection, {
				lang,
				title: headings.skills,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-3",
					children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-relaxed text-ink",
						children: [group.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold",
							children: [group.title, ": "]
						}) : null, group.items.filter((item) => item.trim()).join("  ·  ")]
					}, group.id))
				})
			}) : null,
			langs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvSection, {
				lang,
				title: headings.languages,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink",
					children: langs.map((item) => item.level ? `${item.name} (${item.level})` : item.name).join("  ·  ")
				})
			}) : null,
			training.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvSection, {
				lang,
				title: headings.training,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-ink",
					children: training.join("  ·  ")
				})
			}) : null,
			interests.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvSection, {
				lang,
				title: headings.interests,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-ink",
					children: interests.join("  ·  ")
				})
			}) : null
		]
	});
}
function CvSection({ lang, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: cn("text-xs font-semibold text-accent", lang === "en" ? "uppercase tracking-widest" : "tracking-wide"),
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cv-rule" }),
			children
		]
	});
}
function sampleAccountant(lang) {
	if (lang === "en") return sampleEn();
	return sampleAr();
}
function sampleAr() {
	return {
		id: uid(),
		lang: "ar",
		updatedAt: Date.now(),
		profile: {
			name: "آية محمود حسن",
			headline: "محاسب عام",
			location: "القاهرة",
			phone: "+20 100 000 0000",
			email: "aya.hassan@email.com"
		},
		summary: "محاسب عام بخبرة تتجاوز 7 سنوات في التصنيع والمحاسبة العامة. خبرة عملية في إدارة الدورة المحاسبية الكاملة، بما يشمل الأستاذ العام (General Ledger)، الخزينة (Treasury)، الحسابات الدائنة والمدينة، الرواتب، متابعة المخزون، والتسويات والإقفالات الشهرية. أجيد Excel بشكل متقدم: INDEX MATCH وXLOOKUP وPivot Tables وPower Query وSUMIFS، مع إعداد تقارير تدعم اتخاذ القرار.",
		experience: [{
			id: uid(),
			title: "محاسب عام",
			company: "شركة النور للتصنيع",
			start: "يناير 2025",
			end: "حتى الآن",
			current: true,
			bullets: [
				"تسجيل ومراجعة القيود اليومية للخزينة والمبيعات وتكاليف الإنتاج وفق دليل الحسابات.",
				"إدارة معاملات خزينة تقارب 2 مليون جنيه شهريًا، ومتابعة نحو 300 حركة مالية مع معالجة الفروقات.",
				"متابعة أرصدة الموردين والعملاء وإعداد التسويات قبل الإقفال الشهري.",
				"المساهمة في إعداد ميزان المراجعة والتقارير المالية الدورية للإدارة."
			]
		}, {
			id: uid(),
			title: "محاسب",
			company: "مؤسسة الأفق للخدمات",
			start: "يناير 2021",
			end: "ديسمبر 2024",
			bullets: [
				"مراجعة كشوف رواتب شهرية لأكثر من 400 موظف مع مطابقة الحضور والاستحقاقات.",
				"إدارة عمليات الخزينة ومتابعة الحركة النقدية اليومية والتسويات.",
				"إعداد التقارير الشهرية والمساعدة في أعمال الإقفال المالي."
			]
		}],
		education: [{
			id: uid(),
			degree: "بكالوريوس — تجارة",
			school: "جامعة القاهرة",
			year: "ديسمبر 2016"
		}],
		skillGroups: [{
			id: uid(),
			title: "المهارات التقنية",
			items: [
				"Microsoft Excel — متقدم: XLOOKUP، INDEX MATCH، SUMIFS، Pivot Tables",
				"Power Query",
				"Microsoft Word",
				"Microsoft PowerPoint"
			]
		}, {
			id: uid(),
			title: "مهارات العمل",
			items: [
				"مراجعة وتحليل البيانات المالية",
				"اكتشاف ومعالجة الفروقات والتسويات",
				"إعداد التقارير الداعمة لاتخاذ القرار",
				"الدقة والتنظيم والعمل تحت الضغط"
			]
		}],
		languages: [{
			id: uid(),
			name: "العربية",
			level: "لغة أم"
		}, {
			id: uid(),
			name: "الإنجليزية",
			level: "مستوى مهني للعمل"
		}],
		training: ["برنامج المحاسب المالي المحترف", "دورة Excel المتقدم"],
		interests: ["تعلم الذكاء الاصطناعي في المحاسبة", "تطوير المهارات في البرمجيات المحاسبية"]
	};
}
function sampleEn() {
	return {
		id: uid(),
		lang: "en",
		updatedAt: Date.now(),
		profile: {
			name: "Aya Mahmoud Hassan",
			headline: "General Accountant",
			location: "Cairo",
			phone: "+20 100 000 0000",
			email: "aya.hassan@email.com"
		},
		summary: "General accountant with over 7 years of experience in manufacturing and general accounting. Hands-on ownership of the full accounting cycle, including General Ledger, Treasury, accounts payable and receivable, payroll, inventory tracking, and monthly closings. Advanced Excel (INDEX MATCH, XLOOKUP, Pivot Tables, Power Query, SUMIFS) with reporting that supports decision-making.",
		experience: [{
			id: uid(),
			title: "General Accountant",
			company: "Al Nour Manufacturing",
			start: "January 2025",
			end: "Present",
			current: true,
			bullets: [
				"Record and review daily journals for treasury, sales, and production costs against the chart of accounts.",
				"Manage treasury of about EGP 2 million per month and around 300 movements, clearing variances.",
				"Monitor supplier and customer balances and reconcile before month-end close.",
				"Contribute to the trial balance and periodic management reports."
			]
		}, {
			id: uid(),
			title: "Accountant",
			company: "Al Ofuq Services",
			start: "January 2021",
			end: "December 2024",
			bullets: [
				"Reviewed monthly payroll for 400+ staff, matching attendance and entitlements.",
				"Managed treasury operations and daily cash movement and reconciliations.",
				"Prepared monthly reports and supported financial close."
			]
		}],
		education: [{
			id: uid(),
			degree: "Bachelor of Commerce",
			school: "Cairo University",
			year: "December 2016"
		}],
		skillGroups: [{
			id: uid(),
			title: "Technical Skills",
			items: [
				"Microsoft Excel — Advanced: XLOOKUP, INDEX MATCH, SUMIFS, Pivot Tables",
				"Power Query",
				"Microsoft Word",
				"Microsoft PowerPoint"
			]
		}, {
			id: uid(),
			title: "Working Skills",
			items: [
				"Financial data review and analysis",
				"Detecting and clearing variances",
				"Decision-support reporting",
				"Accuracy, organization, and work under pressure"
			]
		}],
		languages: [{
			id: uid(),
			name: "Arabic",
			level: "Native"
		}, {
			id: uid(),
			name: "English",
			level: "Professional working proficiency"
		}],
		training: ["Professional Financial Accountant Program", "Advanced Excel Course"],
		interests: ["AI applications in accounting", "Accounting software skills"]
	};
}
function seed() {
	const doc = sampleAccountant("ar");
	return {
		uiLang: "ar",
		activeId: doc.id,
		docs: [doc]
	};
}
var useCvStore = create()(persist((set, get) => ({
	hydrated: false,
	...seed(),
	setHydrated: (value) => set({ hydrated: value }),
	setUiLang: (uiLang) => set({ uiLang }),
	setActive: (activeId) => set({ activeId }),
	createDoc: (kind, lang) => {
		const doc = kind === "sample" ? sampleAccountant(lang) : emptyCv(lang);
		set({
			docs: [doc, ...get().docs],
			activeId: doc.id
		});
	},
	duplicateActive: () => {
		const current = get().docs.find((item) => item.id === get().activeId);
		if (!current) return;
		const copy = cloneCv(current);
		if (copy.profile.name) copy.profile.name = `${copy.profile.name} (2)`;
		set({
			docs: [copy, ...get().docs],
			activeId: copy.id
		});
	},
	deleteActive: () => {
		const { docs, activeId, uiLang } = get();
		const nextDocs = docs.filter((item) => item.id !== activeId);
		if (nextDocs.length === 0) {
			const fresh = emptyCv(uiLang);
			set({
				docs: [fresh],
				activeId: fresh.id
			});
			return;
		}
		set({
			docs: nextDocs,
			activeId: nextDocs[0].id
		});
	},
	patchActive: (updater) => {
		const { docs, activeId } = get();
		set({ docs: docs.map((item) => item.id === activeId ? {
			...updater(item),
			updatedAt: Date.now()
		} : item) });
	},
	importDoc: (doc) => {
		const next = isCvDoc(doc) ? {
			...cloneCv(doc),
			updatedAt: Date.now()
		} : emptyCv(get().uiLang);
		set({
			docs: [next, ...get().docs],
			activeId: next.id
		});
	}
}), {
	name: "ats-cv-builder-v1",
	skipHydration: true,
	partialize: (state) => ({
		uiLang: state.uiLang,
		activeId: state.activeId,
		docs: state.docs
	})
}));
function useActiveCv() {
	const docs = useCvStore((s) => s.docs);
	const activeId = useCvStore((s) => s.activeId);
	const uiLang = useCvStore((s) => s.uiLang);
	return docs.find((item) => item.id === activeId) ?? docs[0] ?? emptyCv(uiLang);
}
function CvEditor({ cv, uiLang }) {
	const copy = t(uiLang);
	const patchActive = useCvStore((s) => s.patchActive);
	function patch(updater) {
		patchActive(updater);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-bg-elevated p-5 shadow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-ink",
						children: copy.sectionProfile
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-md bg-bg p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("h-9 rounded-sm px-3 text-xs font-medium", cv.lang === "ar" ? "bg-paper text-ink shadow-panel" : "text-muted"),
							onClick: () => patch((doc) => ({
								...doc,
								lang: "ar"
							})),
							children: copy.cvLangAr
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("h-9 rounded-sm px-3 text-xs font-medium", cv.lang === "en" ? "bg-paper text-ink shadow-panel" : "text-muted"),
							onClick: () => patch((doc) => ({
								...doc,
								lang: "en"
							})),
							children: copy.cvLangEn
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: copy.name,
							value: cv.profile.name,
							onChange: (name) => patch((d) => ({
								...d,
								profile: {
									...d.profile,
									name
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: copy.headline,
							value: cv.profile.headline,
							onChange: (headline) => patch((d) => ({
								...d,
								profile: {
									...d.profile,
									headline
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: copy.email,
							value: cv.profile.email,
							onChange: (email) => patch((d) => ({
								...d,
								profile: {
									...d.profile,
									email
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: copy.phone,
							value: cv.profile.phone,
							onChange: (phone) => patch((d) => ({
								...d,
								profile: {
									...d.profile,
									phone
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: copy.location,
							value: cv.profile.location,
							onChange: (location) => patch((d) => ({
								...d,
								profile: {
									...d.profile,
									location
								}
							}))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-bg-elevated p-5 shadow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold text-ink",
					children: copy.sectionSummary
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: cv.summary,
					rows: 5,
					onChange: (event) => patch((d) => ({
						...d,
						summary: event.target.value
					})),
					className: fieldClass()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-bg-elevated p-5 shadow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-ink",
						children: copy.sectionExperience
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: () => patch((d) => ({
							...d,
							experience: [...d.experience, emptyRole()]
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), copy.addJob]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-col gap-5",
					children: cv.experience.map((role, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-line bg-paper p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: "ghost",
									onClick: () => patch((d) => ({
										...d,
										experience: d.experience.length > 1 ? d.experience.filter((item) => item.id !== role.id) : [emptyRole()]
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), copy.removeJob]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: copy.jobTitle,
										value: role.title,
										onChange: (title) => patch((d) => ({
											...d,
											experience: d.experience.map((item) => item.id === role.id ? {
												...item,
												title
											} : item)
										}))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: copy.company,
										value: role.company,
										onChange: (company) => patch((d) => ({
											...d,
											experience: d.experience.map((item) => item.id === role.id ? {
												...item,
												company
											} : item)
										}))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: copy.start,
										value: role.start,
										onChange: (start) => patch((d) => ({
											...d,
											experience: d.experience.map((item) => item.id === role.id ? {
												...item,
												start
											} : item)
										}))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: copy.end,
										value: role.end,
										onChange: (end) => patch((d) => ({
											...d,
											experience: d.experience.map((item) => item.id === role.id ? {
												...item,
												end,
												current: false
											} : item)
										}))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 flex items-center gap-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: !!role.current,
									onChange: (event) => patch((d) => ({
										...d,
										experience: d.experience.map((item) => item.id === role.id ? {
											...item,
											current: event.target.checked,
											end: event.target.checked ? d.lang === "ar" ? "حتى الآن" : "Present" : item.end
										} : item)
									}))
								}), copy.currentJob]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 block text-xs font-medium text-muted",
								children: [copy.bullets, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: role.bullets.join("\n"),
									rows: Math.max(4, role.bullets.length + 1),
									onChange: (event) => patch((d) => ({
										...d,
										experience: d.experience.map((item) => item.id === role.id ? {
											...item,
											bullets: event.target.value.split("\n")
										} : item)
									})),
									className: cn(fieldClass(), "mt-1")
								})]
							}),
							index < cv.experience.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sr-only",
								children: index
							}) : null
						]
					}, role.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-bg-elevated p-5 shadow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-ink",
						children: copy.sectionEducation
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: () => patch((d) => ({
							...d,
							education: [...d.education, emptyEducation()]
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), copy.addEducation]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-col gap-4",
					children: cv.education.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: copy.degree,
								value: item.degree,
								onChange: (degree) => patch((d) => ({
									...d,
									education: d.education.map((row) => row.id === item.id ? {
										...row,
										degree
									} : row)
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: copy.school,
								value: item.school,
								onChange: (school) => patch((d) => ({
									...d,
									education: d.education.map((row) => row.id === item.id ? {
										...row,
										school
									} : row)
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									className: "flex-1",
									label: copy.year,
									value: item.year,
									onChange: (year) => patch((d) => ({
										...d,
										education: d.education.map((row) => row.id === item.id ? {
											...row,
											year
										} : row)
									}))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "icon",
									variant: "ghost",
									"aria-label": copy.deleteCv,
									onClick: () => patch((d) => ({
										...d,
										education: d.education.length > 1 ? d.education.filter((row) => row.id !== item.id) : [emptyEducation()]
									})),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
								})]
							})
						]
					}, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-bg-elevated p-5 shadow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-ink",
						children: copy.sectionSkills
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: () => patch((d) => ({
							...d,
							skillGroups: [...d.skillGroups, emptySkillGroup(d.lang)]
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), copy.addSkillGroup]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-col gap-4",
					children: cv.skillGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-line bg-paper p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								className: "flex-1",
								label: copy.groupTitle,
								value: group.title,
								onChange: (title) => patch((d) => ({
									...d,
									skillGroups: d.skillGroups.map((row) => row.id === group.id ? {
										...row,
										title
									} : row)
								}))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "ghost",
								onClick: () => patch((d) => ({
									...d,
									skillGroups: d.skillGroups.length > 1 ? d.skillGroups.filter((row) => row.id !== group.id) : [emptySkillGroup(d.lang)]
								})),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-xs font-medium text-muted",
							children: [copy.skillItems, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: group.items.join("\n"),
								rows: Math.max(3, group.items.length),
								onChange: (event) => patch((d) => ({
									...d,
									skillGroups: d.skillGroups.map((row) => row.id === group.id ? {
										...row,
										items: event.target.value.split("\n")
									} : row)
								})),
								className: cn(fieldClass(), "mt-1")
							})]
						})]
					}, group.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-bg-elevated p-5 shadow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-ink",
						children: copy.sectionLanguages
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: () => patch((d) => ({
							...d,
							languages: [...d.languages, emptyLanguage()]
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), copy.addLanguage]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-col gap-3",
					children: cv.languages.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[1fr_1fr_auto] items-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: copy.langName,
								value: item.name,
								onChange: (name) => patch((d) => ({
									...d,
									languages: d.languages.map((row) => row.id === item.id ? {
										...row,
										name
									} : row)
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: copy.langLevel,
								value: item.level,
								onChange: (level) => patch((d) => ({
									...d,
									languages: d.languages.map((row) => row.id === item.id ? {
										...row,
										level
									} : row)
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "ghost",
								onClick: () => patch((d) => ({
									...d,
									languages: d.languages.filter((row) => row.id !== item.id)
								})),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
							})
						]
					}, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-bg-elevated p-5 shadow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold text-ink",
					children: copy.sectionTraining
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: cv.training.join("\n"),
					rows: 3,
					onChange: (event) => patch((d) => ({
						...d,
						training: event.target.value.split("\n")
					})),
					className: cn(fieldClass(), "mt-3")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-bg-elevated p-5 shadow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold text-ink",
					children: copy.sectionInterests
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: cv.interests.join("\n"),
					rows: 3,
					onChange: (event) => patch((d) => ({
						...d,
						interests: event.target.value.split("\n")
					})),
					className: cn(fieldClass(), "mt-3")
				})]
			})
		]
	});
}
function Field({ label, value, onChange, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("block text-xs font-medium text-muted", className),
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (event) => onChange(event.target.value),
			className: cn(fieldClass(), "mt-1")
		})]
	});
}
function fieldClass() {
	return "w-full min-h-11 rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-[box-shadow] duration-150 placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40";
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	const uiLang = useCvStore((s) => s.uiLang);
	const setUiLang = useCvStore((s) => s.setUiLang);
	const hydrated = useCvStore((s) => s.hydrated);
	const docs = useCvStore((s) => s.docs);
	const activeId = useCvStore((s) => s.activeId);
	const setActive = useCvStore((s) => s.setActive);
	const createDoc = useCvStore((s) => s.createDoc);
	const duplicateActive = useCvStore((s) => s.duplicateActive);
	const deleteActive = useCvStore((s) => s.deleteActive);
	const importDoc = useCvStore((s) => s.importDoc);
	const cv = useActiveCv();
	const [tab, setTab] = (0, import_react.useState)("edit");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const copy = t(uiLang);
	(0, import_react.useEffect)(() => {
		const finish = () => useCvStore.getState().setHydrated(true);
		if (useCvStore.persist.hasHydrated()) finish();
		const unsub = useCvStore.persist.onFinishHydration(finish);
		useCvStore.persist.rehydrate();
		return unsub;
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = uiLang;
		document.documentElement.dir = uiLang === "ar" ? "rtl" : "ltr";
	}, [uiLang]);
	async function copyPlain() {
		const text = buildPlainText(cv);
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
		} catch {
			const area = document.createElement("textarea");
			area.value = text;
			area.setAttribute("readonly", "true");
			area.style.position = "fixed";
			area.style.insetInlineStart = "-9999px";
			document.body.appendChild(area);
			area.select();
			const ok = document.execCommand("copy");
			area.remove();
			setCopied(ok);
		}
		window.setTimeout(() => setCopied(false), 1800);
	}
	function saveTxt() {
		downloadBlob(buildPlainText(cv), `${fileStem(cv)}_${cv.lang.toUpperCase()}.txt`, "text/plain;charset=utf-8");
	}
	function saveDoc() {
		downloadBlob(`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${displayName(cv, copy.appName)}</title></head><body>${buildExportHtml(cv)}</body></html>`, `${fileStem(cv)}_${cv.lang.toUpperCase()}.doc`, "application/msword");
	}
	function exportJson() {
		downloadBlob(JSON.stringify(cv, null, 2), `${fileStem(cv)}.json`, "application/json");
	}
	function onImportFile(file) {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const parsed = JSON.parse(String(reader.result));
				if (isCvDoc(parsed)) importDoc(parsed);
			} catch {}
		};
		reader.readAsText(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "no-print sticky top-0 z-20 border-b border-line bg-bg-elevated/95 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-screen-2xl flex-col gap-3 px-4 py-3 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
								children: copy.appName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-lg font-semibold text-ink",
								children: displayName(cv, copy.tagline)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: copy.saved
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => setUiLang(uiLang === "ar" ? "en" : "ar"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, {}), copy.language]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-40 flex-1 items-center gap-2 text-xs text-muted sm:flex-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: copy.pickCv
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: activeId,
									onChange: (event) => setActive(event.target.value),
									className: "h-10 w-full rounded-md border border-line bg-paper px-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
									children: docs.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: doc.id,
										children: displayName(doc, copy.newCv)
									}, doc.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								onClick: () => createDoc("blank", uiLang),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), copy.newCv]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => createDoc("sample", uiLang),
								children: copy.sampleCv
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: duplicateActive,
								children: copy.duplicateCv
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								onClick: deleteActive,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), copy.deleteCv]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-md bg-bg p-1 xl:hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
								active: tab === "edit",
								onClick: () => setTab("edit"),
								children: copy.editTab
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
								active: tab === "cv",
								onClick: () => setTab("cv"),
								children: copy.cvTab
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
								active: tab === "ats",
								onClick: () => setTab("ats"),
								children: copy.atsTab
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfExportButton, {
								cv,
								uiLang
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: saveTxt,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {}), copy.downloadTxt]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: saveDoc,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), copy.downloadDoc]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: copyPlain,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? copy.copied : copy.copyText]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: exportJson,
								children: copy.exportJson
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileInput, {}), copy.importJson]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "application/json,.json",
								className: "hidden",
								onChange: (event) => {
									const file = event.target.files?.[0];
									if (file) onImportFile(file);
									event.target.value = "";
								}
							})
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "print-root mx-auto grid max-w-screen-2xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)] xl:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)_minmax(20rem,24rem)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: cn("no-print min-w-0 xl:block xl:max-h-[calc(100dvh-9rem)] xl:overflow-y-auto", tab === "edit" ? "block" : "hidden"),
					children: hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvEditor, {
						cv,
						uiLang
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: copy.saved
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: cn("min-w-0 xl:block", tab === "cv" ? "block" : "hidden"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						dir: cv.lang === "ar" ? "rtl" : "ltr",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvDocument, { cv })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "no-print mt-3 text-center text-xs text-subtle",
						children: copy.exportHint
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: cn("no-print min-w-0 xl:block", tab === "ats" ? "block" : "hidden"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtsPanel, {
						cv,
						uiLang
					})
				})
			]
		})]
	});
}
function TabButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-10 flex-1 rounded-sm px-3 text-sm font-medium transition-[background-color,color] duration-150", active ? "bg-paper text-ink shadow-panel" : "text-muted hover:text-ink"),
		children
	});
}
//#endregion
export { fileStem as a, filledLanguages as c, dateRange as i, filledLines as l, HEADINGS as n, filledEducation as o, contactLine as r, filledExperience as s, routes_exports as t };
