<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Effects") }}</div>
			<span class="cssProperty">backdrop-filter</span>
		</template>

		<template #values>
			<v-combobox
				v-model="selectedEffects"
				:items="overlayEffectsObjects"
				item-title="title"
				item-value="name"
				multiple
				chips
				clearable
				closable-chips
				variant="solo-filled"
				return-object
				@update:model-value="onSelect"
			/>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";
	import { overlayEffects } from "../../../../digitalniweb-custom/variables/css";
	import type { languages } from "../../../../digitalniweb-types";
	import type {
		overlayEffect,
		overlayEffectsObject as overlayEffectsObjectType,
		overlayEffects as overlayEffectsType,
	} from "../../../../digitalniweb-types/css";

	const translations = {
		darken: { cs: "ztmavit" },
		lighten: { cs: "zesvětlit" },
		blur: { cs: "rozmazat" },
		desaturate: { cs: "černobílá", en: "black & white" },
	} as {
		[key in overlayEffect]: {
			[key in languages]?: string;
		};
	};
	const { translate } = useTranslations(translations);

	// model visible to parent — array of strings
	const selectedEffectsModel = defineModel<overlayEffectsType>({
		default: [],
	});

	// local model for the combobox — array of objects
	const selectedEffects = ref<overlayEffectsObjectType[]>([]);

	onMounted(() => {
		overlayEffectsObjects.value.forEach((effect) => {
			if (selectedEffectsModel.value.includes(effect.name))
				selectedEffects.value.push(effect);
		});
	});

	// computed list of selectable items
	const overlayEffectsObjects = computed(() =>
		overlayEffects.map((effect) => ({
			name: effect,
			title: translate(effect),
		}))
	);

	// selection handler
	function onSelect(newVal: overlayEffectsObjectType[]) {
		if (!Array.isArray(newVal)) return;

		let result = [...newVal];
		const lastPicked = result.at(-1);

		// drop manually typed values not in overlayEffects
		if (lastPicked && !overlayEffects.includes(lastPicked.name as any)) {
			result = result.slice(0, -1);
		}

		// ensure mutual exclusion between darken/lighten
		const hasDarken = result.some((e) => e.name === "darken");
		const hasLighten = result.some((e) => e.name === "lighten");

		if (hasDarken && hasLighten) {
			if (lastPicked?.name === "darken") {
				result = result.filter((e) => e.name !== "lighten");
			} else if (lastPicked?.name === "lighten") {
				result = result.filter((e) => e.name !== "darken");
			}
		}

		selectedEffects.value = result;
		selectedEffectsModel.value = result.map(
			(e) => e.name
		) as overlayEffectsType;
	}
</script>
