<template>
	<v-dialog
		v-model="confirmStore.dialog"
		:max-width="confirmStore.options.width"
		@keydown.esc="confirmStore.cancel()"
	>
		<v-card>
			<v-toolbar dark :color="confirmStore.options.color" dense flat>
				<v-toolbar-title class="white--text">{{
					confirmStore.title
				}}</v-toolbar-title>
			</v-toolbar>
			<v-card-text
				v-if="confirmStore.message"
				class="pa-4 text-center"
				v-html="confirmStore.message"
			></v-card-text>
			<v-card-actions class="pt-0">
				<v-spacer></v-spacer>
				<v-btn variant="text" @click="confirmStore.cancel()"
					>Cancel</v-btn
				>
				<v-btn
					depressed
					:color="confirmStore.options.color"
					@click="confirmStore.agree()"
					>Yes</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script lang="ts" setup>
	import { useConfirmStore } from "@/store/confirm";
	const confirmStore = useConfirmStore();
</script>
