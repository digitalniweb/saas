import {
	BaseKit,
	Blockquote,
	Bold,
	BulletList,
	Clear,
	CodeBlock,
	Color,
	FontFamily,
	FontSize,
	Fullscreen,
	Heading,
	Highlight,
	History,
	HorizontalRule,
	Image,
	Indent,
	Italic,
	Link,
	OrderedList,
	Strike,
	SubAndSuperScript,
	Table,
	TaskList,
	TextAlign,
	Underline,
	Video,
	VuetifyTiptap,
	VuetifyViewer,
	createVuetifyProTipTap,
} from "vuetify-pro-tiptap";

import "vuetify/styles";
import "vuetify-pro-tiptap/styles/editor.css";
import "vuetify-pro-tiptap/styles/markdown.css";

import LinkDialog from "~~/custom/tiptap/extensions/LinkDialog.vue";
import SelectImage from "~~/custom/tiptap/extensions/SelectImage.vue";

import sourceCode from "~~/custom/tiptap/extensions/sourceCode";
import type { extendedLinkKeys } from "~~/custom/tiptap/types";

const ExtendedLink = Link.extend({
	addAttributes() {
		return {
			href: {
				default: null,
			},
			target: {
				default: null,
			},
			class: {
				default: this.options.HTMLAttributes.class,
			},
			title: {
				default: this.options.HTMLAttributes.title,
			},
			rel: {
				default: null,
			},
		} as Record<extendedLinkKeys, { default: null | string }>;
	},
});

const vuetifyProTipTap = createVuetifyProTipTap({
	lang: "en",
	markdownTheme: "github",
	components: {
		VuetifyTiptap,
		VuetifyViewer,
	},
	extensions: [
		BaseKit.configure({
			placeholder: {
				placeholder: "Enter text...",
			},
			characterCount: false,
		}),
		Bold,
		Italic,
		Underline,
		Strike,
		Heading.configure({
			levels: [1, 2, 3, 4, 5, 6],
		}),
		TextAlign,
		FontFamily,
		FontSize,
		Color,
		Highlight.configure({ divider: true }),
		SubAndSuperScript.configure({ divider: true }),
		Clear.configure({ divider: true }),
		BulletList,
		OrderedList,
		TaskList,
		Indent.configure({ divider: true }),
		ExtendedLink.configure({
			dialogComponent: () => markRaw(LinkDialog),
		}),
		Image.configure({
			imageTabs: [{ name: "SELECT", component: markRaw(SelectImage) }],
			width: 500,
			hiddenTabs: ["upload", "url"],
		}),
		Video,
		Table.configure({ divider: true }),
		Blockquote,
		HorizontalRule,
		CodeBlock.configure({ divider: true }),
		History.configure({ divider: true }),
		Fullscreen.configure({
			useWindow: true,
			divider: true,
		}),
		sourceCode,
	],
});

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(vuetifyProTipTap);
});
