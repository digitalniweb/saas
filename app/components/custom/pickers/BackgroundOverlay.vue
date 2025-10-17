<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Effects") }}</div>
			<span class="cssProperty">backdrop-filter</span>
		</template>
		<template #values>
			<v-combobox
				v-model="selectedEffects"
				:items="overlayEffects"
				multiple
				chips
				clearable
				closable-chips
				variant="solo-filled"
				@update:model-value="onSelect"
			></v-combobox>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	const { translate } = useTranslations();
	import { overlayEffects } from "../../../../digitalniweb-custom/variables/css";
	import type { overlayEffects as overlayEffectsType } from "../../../../digitalniweb-types/css";

	function onSelect(newVal: overlayEffectsType) {
		const lastPicked = newVal[newVal.length - 1];
		// ensure mutual exclusion between darken/lighten
		if (newVal.includes("darken") && newVal.includes("lighten")) {
			if (lastPicked === "darken") {
				newVal = newVal.filter((i) => i !== "lighten");
			} else if (lastPicked === "lighten") {
				newVal = newVal.filter((i) => i !== "darken");
			}
		}
		// ensure only items in provided list can be added. User can write into combobox to filter things
		if (!overlayEffects.includes(lastPicked)) newVal.pop();

		selectedEffects.value = [...newVal];
	}
	const selectedEffects = defineModel<overlayEffectsType>({ default: [] });
</script>
