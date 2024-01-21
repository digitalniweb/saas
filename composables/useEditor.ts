import Editor from "@tinymce/tinymce-vue";
import { TinyMCE as tinymceImport, EditorOptions } from "tinymce";
let tinymce: tinymceImport | undefined;
// import innerLink from "./plugins/innerLink.js"; // this file can be anywhere, get it from vue2 project
let editorConfig: Partial<EditorOptions> = {};

if (process.client) {
	tinymce = (await import("tinymce")).default;

	// tinymce needs 'baseUrl' so It needs to be exposed in "public" folder
	// importing separate plugins, themes etc. doesn't work because it doesn't get files from node_modules
	// e.g. this doesn't work: await import("tinymce/themes/silver");
	tinymce.baseURL = "/tinymce";

	// Editor = (await import("@tinymce/tinymce-vue")).default;

	// need to be done - add useStore language and refactor it
	// let language_url =
	// 	store.state.language.admin.currentMutation === "en"
	// 		? ""
	// 		: "/tinymce/langs/" + store.state.language.admin.currentMutation + ".js";

	editorConfig = {
		promotion: false,
		plugins: ["lists", "link", "image"],
		toolbar:
			"formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | innerLink | link | image | myCustomToolbarButton | mybutton | tinymceexample | code",
		height: 500,

		// link plugin
		link_context_toolbar: true,

		// (dis)allow valid elements and attributes
		valid_elements: "*[*]",

		//languages
		// language: store.state.language.admin.currentMutation,
		// language_url,

		// file urls
		relative_urls: false,
		remove_script_host: true,
		document_base_url: process.env.BASE_URL,
		convert_urls: true,

		// image plugin options
		// https://www.tiny.cloud/docs/plugins/image/
		image_advtab: true,
		image_caption: true,
		// file picker / browser / manager options
		// https://www.tiny.cloud/docs/plugins/image/#file_picker_callback
		file_picker_types: "file image",
		file_picker_callback: async function (callback, value, meta) {
			// Provide file and text for the link dialog
			if (meta.filetype == "file") {
				let toxTinyMceAux: HTMLElement | null =
					document.querySelector(".tox-tinymce-aux");
				console.log("file", toxTinyMceAux);
				if (!toxTinyMceAux) return;
				// toxTinyMceAux.style.display = "none";
				// let openFB = await store.dispatch("openFileBrowser", { open: true });
				// toxTinyMceAux
				// 	.style.removeProperty("display");
				// if (!openFB) return;
				// callback(openFB[0]);
			}

			// Provide image and alt text for the image dialog
			if (meta.filetype == "image") {
				let toxTinyMceAux: HTMLElement | null =
					document.querySelector(".tox-tinymce-aux");
				console.log("image", toxTinyMceAux);

				if (!toxTinyMceAux) return;
				// toxTinyMceAux.style.display = "none";
				// let openFB = await store.dispatch("openFileBrowser", {
				// 	open: true,
				// 	options: { maxUploadFileSize: 5242880 },
				// });
				// toxTinyMceAux
				// 	.style.removeProperty("display");
				// if (!openFB) return;
				// callback(openFB[0]);
			}
		},

		end_container_on_empty_block: true,

		setup: function () {
			// Here we can add custom plugins
			// https://www.tiny.cloud/docs/ui-components/typesoftoolbarbuttons/#splitbuttonexampleandexplanation
			// tinymce?.PluginManager.add("innerLink", innerLink);
			// tinymce?.PluginManager.add("myCustomToolbarButton", cuPlugin);
			// tinymce?.PluginManager.add("mybutton", customPlugin);
			// tinymce?.PluginManager.add("tinymceexample", tinymceexample);
		},
	};
}

export const useEditor = () => {
	return {
		Editor: process.client ? Editor : null,
		editorConfig,
	};
};
