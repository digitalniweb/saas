<template>
	<div :class="fileChosenClass">
		<v-text-field
			variant="underlined"
			:label="translate(props.name)"
			counter="255"
			:prepend-inner-icon="props.icon"
			v-model="path"
			:rules="props.rules"
			validate-on="blur"
			ref="textField"
			:disabled="props.disabled"
		>
			<template v-slot:append>
				<v-btn
					v-if="path"
					color="red"
					variant="text"
					small
					@click="clearText"
					class="mr-2"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
				<v-btn color="primary" fab small @click="chooseFile()">
					<v-icon>{{ props.iconButton }}</v-icon>
				</v-btn>
			</template>
		</v-text-field>
		<v-img
			v-if="path"
			max-width="200"
			:src="path as string | undefined"
			rounded
			class="elevation-5"
		/>
	</div>
</template>
<script setup lang="ts" generic="T">
	import { useFileManagerStore } from "@/store/fileManager";
	import { validImages } from "~~/digitalniweb-custom/variables/validImages";
	import type { translations } from "~~/digitalniweb-types/translations";
	import type { validImages as validImagesType } from "~~/digitalniweb-types/validImages";

	// this will get us vuetify's ValidationRule type = ValidationRule$1[]
	import type { VTextField } from "vuetify/components";
	type UnwrapReadonlyArray<A> = A extends Readonly<Array<infer I>> ? I : A;
	type ValidationRule = UnwrapReadonlyArray<VTextField["rules"]>;

	const fileManagerStore = useFileManagerStore();

	// Usage:
	/* <customFormPickFiles
        v-model="formdata.image"
        name="Main image"
        :translation="{ 'Main image': { cs: 'Hlavní obrázek' } }"
    /> */
	const props = withDefaults(
		defineProps<
			{
				object?: T;
				property?: keyof T;
				icon?: string;
				iconButton?: string;
				rules?: ValidationRule[];
				disabled?: boolean;
			} & (
				| { translation: translations; name: string } // if `translation` is provided then `name` is required
				| { translation?: undefined; name?: string }
			) //if `translation` is not provided then `name` is optional
		>(),
		{
			name: "Image",
			icon: "mdi-image",
			iconButton: "mdi-folder-image",
			disabled: false,
		}
	);

	const path = defineModel<string | null>({
		default: "",
	});

	// if (path.value === null) path.value = "";

	const textField = ref<InstanceType<typeof VTextField>>();

	const { translate } = useTranslations(props.translation);
	const chooseFile = async <T,>(multipleSelect: boolean = false) => {
		let img = await fileManagerStore.open({ multipleSelect });

		if (!img) {
			path.value = "";
			return;
		}
		if (multipleSelect) path.value = img.join(",");
		else path.value = img[0] ?? "";
		textField.value?.validate();
	};

	const clearText = () => {
		path.value = "";
		textField.value?.validate();
	};

	const fileChosenClass = computed(() => {
		let file = path.value;
		if (!file) return "";
		let fileExtension = file.split(".").pop() ?? "";
		if (!validImages.includes(fileExtension as validImagesType)) return "";
		return "bg-grey-darken-3 pa-2 mb-1 rounded";
	});
</script>
