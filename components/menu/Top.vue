<template>
	<v-menu
		v-for="(item, index) in items"
		open-on-hover
		location="bottom"
		:key="index"
		eager
		class="mainMenuTop"
	>
		<template v-slot:activator="{ props }">
			<v-btn
				v-bind="props"
				:href="item.url"
				color="primary"
				variant="tonal"
				class="mx-2"
			>
				{{ item.name }}
			</v-btn>
		</template>
		<MenuSubmenus
			:items="item.children"
			v-if="item.children"
			class="mainMenuTop"
		/>
	</v-menu>
</template>

<script setup>
	const props = defineProps({
		items: {
			type: Array,
			required: true,
		},
		buttonsProps: {
			type: Object,
			default: null,
		},
	});

	const buttons = ref(props.buttonsProps || {});

	const computedButtons = computed(() => buttons.value);
</script>

<style></style>
