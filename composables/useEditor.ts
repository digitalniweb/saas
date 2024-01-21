import TinyEditor from "@tinymce/tinymce-vue";
let tinymce;
let Editor: typeof TinyEditor | undefined;
let editorConfig = {
	promotion: false,
	plugins: "lists link image",
	toolbar:
		"formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | innerLink | link | image | myCustomToolbarButton | mybutton | tinymceexample | code",
};

if (process.client) {
	tinymce = (await import("tinymce")).default;

	// tinymce needs 'baseUrl' so It needs to be exposed in "public" folder
	// importing separate plugins, themes etc. doesn't work because it doesn't get files from node_modules
	// e.g. this doesn't work: await import("tinymce/themes/silver");
	tinymce.baseURL = "/tinymce";

	Editor = (await import("@tinymce/tinymce-vue")).default;
}

export const useEditor = () => {
	return {
		Editor: process.client ? Editor : null,
		editorConfig,
	};
};
