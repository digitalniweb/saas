<template>
	<client-only>
		<v-dialog
			v-model="fileManagerStore.opened"
			fullscreen
			hide-overlay
			:retain-focus="false"
			transition="dialog-bottom-transition"
			persistent
			no-click-animation
		>
			<v-card>
				<v-toolbar>
					<v-toolbar-title>FILE MANAGER</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="cancel">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-list three-line subheader>
					<v-list-item>
						<v-list-item-title>Prohlížeč souborů</v-list-item-title>
						<v-list-item-subtitle class="mb-5"
							>Nahrajte a označte data, která chcete vložit do
							editoru</v-list-item-subtitle
						>
						<FileBrowser :tree="fileManagerStore.tree" />
					</v-list-item>
					<v-list-item>
						<v-list-item-title class="text-right py-3">
							<v-btn class="mr-3" @click="cancel">Zavřít</v-btn>
							<v-btn color="primary" @click="confirm"
								>Vložit</v-btn
							>
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-card>
		</v-dialog>
	</client-only>
</template>
<style lang="scss"></style>
<script setup lang="ts">
	import FileBrowser from "./FileBrowser.vue";
	import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();

	const cancel = async () => {
		fileManagerStore.opened = false;
	};
	const confirm = async () => {
		fileManagerStore.confirm();
	};
</script>
