<template>
	<!-- I am not using this anywhere yet -->
	<v-row>
		<v-col lg="3" cols="12" class="align-content-center pt-lg-0 mt-lg-n5">
			<v-tooltip :text="translate('Padding')">
				<template v-slot:activator="{ props }">
					<span v-bind="props" class="cssProperty"> padding </span>
				</template>
			</v-tooltip>
		</v-col>
		<v-col lg="7" cols="12">
			<v-row>
				<v-col cols="12" class="pt-lg-0">
					<v-number-input
						v-model="padding.top"
						variant="solo-filled"
						density="compact"
						max-width="200px"
						class="mx-lg-auto"
						prepend-icon="mdi-dock-top"
						:min="0"
					/>
				</v-col>
				<v-col cols="12" lg="6" class="pt-lg-0">
					<v-number-input
						v-model="padding.left"
						variant="solo-filled"
						density="compact"
						max-width="200px"
						class="mx-lg-auto"
						prepend-icon="mdi-dock-left"
						:min="0"
					/>
				</v-col>
				<v-col cols="12" lg="6" class="pt-lg-0">
					<v-number-input
						v-model="padding.right"
						variant="solo-filled"
						density="compact"
						max-width="200px"
						class="mx-lg-auto"
						prepend-icon="mdi-dock-right"
						:min="0"
					/>
				</v-col>
				<v-col cols="12" class="pt-lg-0">
					<v-number-input
						v-model="padding.bottom"
						variant="solo-filled"
						density="compact"
						max-width="200px"
						class="mx-lg-auto"
						prepend-icon="mdi-dock-bottom"
						:min="0"
					/>
				</v-col>
			</v-row>
		</v-col>
		<v-col lg="2" cols="12" class="align-content-center pt-lg-0">
			<v-select
				v-model="paddingUnits"
				:items="lengthUnits"
				variant="solo-filled"
				density="compact"
				max-width="200px"
				class="mx-lg-auto"
				:label="translate('Units')"
			/>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
	// ! this might not work  100 %. Needs to be revisited
	import { lengthUnits } from "~~/digitalniweb-custom/variables/css";
	import type { lengthUnits as lengthUnitsType } from "~~/digitalniweb-types/css";
	const { translate } = useTranslations();

	type direction = {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
	const options = defineModel<string | null>({
		default: null,
	});

	const paddingUnits = ref<lengthUnitsType>("px");

	const padding = ref<direction>({ top: 0, right: 0, bottom: 0, left: 0 });
	watch(
		[() => padding.value, () => paddingUnits.value],
		() => {
			if (
				padding.value.top === 0 &&
				padding.value.right === 0 &&
				padding.value.bottom === 0 &&
				padding.value.left === 0
			) {
				options.value = null;
				return;
			}
			options.value = `${padding.value.top}${paddingUnits.value} ${padding.value.right}${paddingUnits.value} ${padding.value.bottom}${paddingUnits.value} ${padding.value.left}${paddingUnits.value}`;
		},
		{ deep: true, immediate: true }
	);
</script>
