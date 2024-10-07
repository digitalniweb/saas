<template>
	<VDialog
		v-model="dialog"
		max-width="400"
		activator="parent"
		@click:outside="close"
		@update:model-value="open"
	>
		<VCard>
			<VToolbar class="px-6" density="compact">
				<span class="headline">{{
					locale.message[locale.lang]["editor.link.dialog.title"]
				}}</span>

				<VSpacer />

				<VBtn class="mx-0" icon @click="close">
					<VIcon icon="$close" />
				</VBtn>
			</VToolbar>

			<VCardText>
				<VTextField
					v-model="extendedLinkProperties.href"
					:label="
						locale.message[locale.lang]['editor.link.dialog.link']
					"
					autofocus
				>
					<template v-slot:append>
						<v-btn
							color="primary"
							fab
							small
							@click="chooseFileFromServer"
						>
							<v-icon>mdi-folder-image</v-icon>
						</v-btn>
					</template>
				</VTextField>

				<VTextField
					v-model="extendedLinkProperties.title"
					label="title"
				/>
				<VTextField
					v-model="extendedLinkProperties.class"
					label="class"
				/>

				<VTextField
					v-model="extendedLinkProperties.rel"
					:label="
						locale.message[locale.lang]['editor.link.dialog.rel']
					"
				/>

				<VCheckbox
					v-model="extendedLinkProperties.target"
					:label="
						locale.message[locale.lang][
							'editor.link.dialog.openInNewTab'
						]
					"
					color="primary"
					false-value=""
					true-value="_blank"
				/>
			</VCardText>

			<VCardActions>
				<VBtn @click="apply">
					{{
						locale.message[locale.lang][
							"editor.link.dialog.button.apply"
						]
					}}
				</VBtn>
			</VCardActions>
		</VCard>
	</VDialog>
</template>
<script setup lang="ts">
	import { locale } from "vuetify-pro-tiptap";
	import type { Editor } from "@tiptap/vue-3";
	import { getAttributes } from "@tiptap/vue-3";

	import type { extendedLink } from "../types.js";

	import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();

	const extendedLinkProperties = ref<extendedLink>({});

	const open = (e: any) => {
		extendedLinkProperties.value = getAttributes(
			props.editor.state,
			"link"
		);
	};

	interface Props {
		editor: Editor;
	}

	const chooseFileFromServer = async () => {
		let img = await fileManagerStore.open({ multipleSelect: false });
		extendedLinkProperties.value.href = img[0];
	};

	const props = withDefaults(defineProps<Props>(), {});

	const dialog = ref<boolean>(false);

	function apply() {
		const {
			href,
			target,
			rel,
			title,
			class: className,
		} = extendedLinkProperties.value;

		if (href) {
			props.editor
				.chain()
				.focus()
				.extendMarkRange("link")
				//@ts-ignore
				.setLink({ href, target, rel, title, class: className })
				.run();
		} else {
			props.editor.chain().focus().unsetLink().run();
		}
		close();
	}

	function close() {
		dialog.value = false;
	}
</script>
