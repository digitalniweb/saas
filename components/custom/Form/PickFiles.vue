<template>
	<div :class="fileChosenClass">
		<v-text-field
			variant="underlined"
			:label="translate(props.name)"
			counter="255"
			:prepend-inner-icon="props.icon"
			v-model="props.object[props.property]"
			:rules="props.rules"
			validate-on="blur"
			ref="textField"
			:disabled="props.disabled"
		>
			<template v-slot:append>
				<v-btn
					v-if="props.object[props.property]"
					color="red"
					variant="text"
					small
					@click="clearText"
					class="mr-2"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
				<v-btn
					color="primary"
					fab
					small
					@click="chooseFile(props.property, props.object)"
				>
					<v-icon>{{ props.iconButton }}</v-icon>
				</v-btn>
			</template>
		</v-text-field>
		<v-img
			v-if="props.object[props.property]"
			max-width="200"
			:src="props.object[props.property] as string | undefined"
			rounded
			class="elevation-5"
		/>
	</div>
</template>
<script setup lang="ts" generic="T">
	import { useFileManagerStore } from "@/store/fileManager";
	import { translations } from "~/digitalniweb-types/translations";
	import { validImages } from "~/digitalniweb-custom/variables/validImages";
	import { validImages as validImagesType } from "~/digitalniweb-types/validImages";

	// this will get us vuetify's ValidationRule type = ValidationRule$1[]
	import type { VTextField } from "vuetify/components";
	type UnwrapReadonlyArray<A> = A extends Readonly<Array<infer I>> ? I : A;
	type ValidationRule = UnwrapReadonlyArray<VTextField["rules"]>;

	const fileManagerStore = useFileManagerStore();

	// Usage:
	/* <customFormPickFiles
        :object="formdata"
        property="mainImage"
        name="Main image"
        :translation="{ 'Main image': { cs: 'Hlavní obrázek' } }"
    /> */
	const props = withDefaults(
		defineProps<
			{
				object: T;
				property: keyof T;
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

	const textField = ref<InstanceType<typeof VTextField>>();

	const { translate } = useTranslations(props.translation);
	const chooseFile = async <T>(
		property: keyof T,
		object: T,
		multipleSelect: boolean = false
	) => {
		let img = await fileManagerStore.open({ multipleSelect });
		if (object[property] === undefined) return;
		if (multipleSelect) (object[property] as string) = img.join(",");
		else (object[property] as string) = img[0] ?? "";
		textField.value?.validate();
	};

	const clearText = () => {
		(props.object[props.property] as string) = "";
		textField.value?.validate();
	};

	const fileChosenClass = computed(() => {
		let file = props.object[props.property] as string;
		if (!file) return "";
		let fileExtension = file.split(".").pop() ?? "";
		if (!validImages.includes(fileExtension as validImagesType)) return "";
		return "bg-grey-darken-3 pa-2 mb-1 rounded";
	});
</script>
