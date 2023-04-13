<template>
	<v-list class="pa-0">
		<v-list-item
			v-for="(item, index) in items"
			:key="index"
			class="pa-0 ma-0"
		>
			<template v-if="item.children">
				<v-menu open-on-hover location="end" eager :class="class">
					<template v-slot:activator="{ props }">
						<v-btn v-bind="props" :href="item.url" block>
							{{ item.name }}
						</v-btn>
					</template>
					<MenuSubmenus :items="item.children" />
				</v-menu>
			</template>
			<template v-else>
				<v-btn :href="item.url" block class="justify-start">
					{{ item.name }}
				</v-btn>
			</template>
		</v-list-item>
	</v-list>
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
		class: {
			type: String,
			default: "",
		},
	});

	const buttons = ref(props.buttonsProps || {});

	const computedButtons = computed(() => buttons.value);
</script>
