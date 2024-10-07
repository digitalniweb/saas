<template>
	<VTextField v-model="props.modelValue.src" label="Image src">
		<template v-slot:append>
			<v-btn color="primary" fab small @click="chooseFileFromServer">
				<v-icon>mdi-folder-image</v-icon>
			</v-btn>
		</template>
	</VTextField>

	<VTextField v-model="props.modelValue.alt" label="Alt" />

	<VCheckbox
		v-model="props.modelValue.lockAspectRatio"
		label="Lock original aspect ratio"
	/>
</template>
<script setup lang="ts">
	import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();

	interface SelectImageProps {
		modelValue?: Record<string, string>;
		// these 2 are automatically passed from parent, just let it here
		upload?: (file: File) => Promise<string>; // vue warn
		t: (path: string) => string; // vue warn
	}

	interface SelectImageEmits {
		(event: "update:modelValue"): void;
	}

	const props = withDefaults(defineProps<SelectImageProps>(), {
		modelValue: () => ({}),
	});

	const emits = defineEmits<SelectImageEmits>();

	const chooseFileFromServer = async () => {
		let img = await fileManagerStore.open({ multipleSelect: false });
		props.modelValue.src = img[0];
	};
</script>
