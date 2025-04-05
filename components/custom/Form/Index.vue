<template>
	<v-row align="center" justify="center" class="my-5 pt-5">
		<v-col cols="12" lg="4" xl="6">
			<v-card class="elevation-12">
				<v-toolbar
					color="primary"
					prominent
					flat
					:image="formHeader?.image"
				>
					<v-overlay class="absolute" z-index="0"></v-overlay>
					<v-toolbar-title class="relative white--text">
						{{ formHeader?.headline }}
					</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-form
						ref="form"
						lazy-validation
						:disabled="props.disabled"
					>
						<slot></slot>
					</v-form>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	import type { formHeader } from "~/types/components/form";
	const props = defineProps<{
		formHeader?: formHeader;
		disabled?: boolean;
	}>();

	// we have to create computed property if we want props as nested objects with default values
	let formHeader = computed(
		(): formHeader => ({
			...props.formHeader,
			headline: props.formHeader?.headline || "Form",
		})
	);
</script>
