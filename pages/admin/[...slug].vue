<template>
	<component :is="currentComponent" />
	<CustomEditor></CustomEditor>
	<v-card v-for="card in cards" :key="card" cols="12">
		<v-list lines="two">
			<v-list-subheader>{{ card }}</v-list-subheader>
			<template v-for="n in 6" :key="n">
				<v-list-item>
					<template v-slot:prepend>
						<v-avatar color="grey-darken-1"></v-avatar>
					</template>

					<v-list-item-title>Message {{ n }}</v-list-item-title>

					<v-list-item-subtitle>
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Nihil repellendus distinctio similique
					</v-list-item-subtitle>
				</v-list-item>

				<v-divider
					v-if="n !== 6"
					:key="`divider-${n}`"
					inset
				></v-divider>
			</template>
		</v-list>
	</v-card>
</template>
<script setup lang="ts">
	// Here needs to be list of all global components which we want to dynamically use. Then we need to import these components from '#components' and add this to 'components' variable
	type componentNames = "AdminPagesWebInformation";

	import { AdminPagesWebInformation } from "#components";
	import { computed, ref, watch } from "#imports";
	import { useRoute } from "nuxt/app";
	import type { GlobalComponents } from "vue-demi";

	type components = Pick<GlobalComponents, componentNames>;
	const components = {
		AdminPagesWebInformation,
	};
	const route = useRoute();
	const componentName = ref<componentNames | "div">("div");
	let currentComponent = computed((): any =>
		componentName.value !== "div" ? components[componentName.value] : "div"
	);
	const loadPage = () => {
		let adminPrefix = "/admin";
		let routes: { [key: string]: componentNames } = {
			[adminPrefix + "/webinformation"]: "AdminPagesWebInformation",
		};
		componentName.value = routes[route.path] ?? "div";
	};
	watch(
		route,
		() => {
			loadPage();
		},
		{ deep: true, immediate: true }
	);
	definePageMeta({
		layout: "admin",
	});
	const cards = ref(["1", 2]);
</script>
