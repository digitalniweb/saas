<template>
	<v-snackbar
		v-for="(snackBar, index) in snackBars.filter((s) => s.show)"
		:key="snackBar.id"
		:model-value="snackBar.show"
		:color="snackBar.color"
		:timeout="snackBar.timeout"
		location="top right"
		:style="`top:${60 * index + 10}px`"
		position="fixed"
		@update:modelValue="snackBarClose(snackBar)"
	>
		<v-icon> mdi-{{ snackBar.icon }} </v-icon>
		<v-icon @click="snackBarClose(snackBar)" class="float-right">
			mdi-close
		</v-icon>
		<span v-html="snackBar.text"></span>
	</v-snackbar>
</template>
<script lang="ts" setup>
	import { useSnackBarsStore } from "@/store/snackBars";
	import { storeToRefs } from "pinia";
	const store = useSnackBarsStore();
	const { snackBars } = storeToRefs(store);

	const snackBarClose = (snackBar: any) => {
		store.removeSnackBar(snackBar);
	};
</script>
