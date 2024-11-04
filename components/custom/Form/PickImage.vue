<template>
	<div :class="imageFilledClass">
		<v-text-field
			variant="underlined"
			:label="translate(props.name)"
			counter="255"
			prepend-inner-icon="mdi-image"
			v-model="props.object[props.property]"
			dense
		>
			<template v-slot:append>
				<v-btn
					v-if="props.object[props.property]"
					color="red"
					variant="text"
					small
					@click="(props.object[props.property] as string) = ''"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
				<v-btn
					color="primary"
					fab
					small
					@click="chooseImage(props.property, props.object)"
				>
					<v-icon>mdi-folder-image</v-icon>
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
	const fileManagerStore = useFileManagerStore();

	// Usage:
	/* <CustomFormPickImage
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
			} & (
				| { translation: translations; name: string } // if `translation` is provided then `name` is required
				| { translation?: undefined; name?: string }
			) //if `translation` is not provided then `name` is optional
		>(),
		{
			name: "Image",
		}
	);

	const { translate } = useTranslations(props.translation);
	const chooseImage = async <T>(
		property: keyof T,
		object: T,
		multipleSelect: boolean = false
	) => {
		let img = await fileManagerStore.open({ multipleSelect });
		if (object[property] === undefined) return;
		if (multipleSelect) (object[property] as string) = img.join(",");
		else (object[property] as string) = img[0] ?? "";
	};

	const imageFilledClass = computed(() => {
		if (!props.object[props.property]) return "";
		return "bg-grey-darken-3 pa-2 mb-1 rounded";
	});
</script>
