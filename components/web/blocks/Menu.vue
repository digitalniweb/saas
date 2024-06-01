<template>
	<v-app-bar ref="appBar" class="px-5" rounded flat>
		<template v-slot:prepend v-if="false">
			<nuxt-link variant="plain" to="/">
				<v-avatar image="/img/logo.png" tile start size="80" />
			</nuxt-link>
		</template>
		<nuxt-link variant="plain" to="/">
			<v-avatar image="/img/logo.png" tile start size="80" />
		</nuxt-link>
		<WebMenuList :levelitems="menu" :ulid="'navitems'" />
		<template v-slot:append>
			<v-tooltip
				:text="localeModules('users', 'Register', 'name')"
				location="bottom"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						icon="mdi-account-plus"
						v-bind="props"
						:to="localeModules('users', 'Register', 'url')"
					></v-btn>
				</template>
			</v-tooltip>
			<v-tooltip
				location="bottom"
				:text="localeModules('users', 'Login', 'name')"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						icon="mdi-account-arrow-left"
						v-bind="props"
						:to="localeModules('users', 'Login', 'url')"
					></v-btn>
				</template>
			</v-tooltip>
			<v-tooltip
				:text="localeModules('users', 'Logout', 'name')"
				location="bottom"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						icon="mdi-account-arrow-right"
						v-bind="props"
						:to="localeModules('users', 'Logout', 'url')"
					></v-btn>
				</template>
			</v-tooltip>

			<v-tooltip
				:text="localeModules('users', 'Profile', 'name')"
				location="bottom"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						icon="mdi-account"
						v-bind="props"
						:to="localeModules('users', 'Profile', 'url')"
					></v-btn>
				</template>
			</v-tooltip>
		</template>
	</v-app-bar>
</template>
<script setup lang="ts">
	import { useMenusStore } from "@/store/menus";
	import { storeToRefs } from "pinia";
	import { useCurrentPageStore } from "../../../store/currentPage";
	import { useModulesStore } from "../../../store/modules";
	import { modules } from "../../../digitalniweb-types/functionality/modules";
	import { ModulePageLanguage } from "../../../digitalniweb-types/models/globalData";
	import { InferAttributes } from "sequelize";

	const currentPage = useCurrentPageStore();
	const modules = useModulesStore();

	const { articles: menu } = storeToRefs(useMenusStore());
	const appBar = ref();

	function localeModules(
		module: modules,
		modulePage: string,
		column: keyof InferAttributes<ModulePageLanguage>
	) {
		let currModule = modules.globalData.find((m) => m.name === module);
		let currModulePage = currModule?.ModulePages?.find(
			(mp) => mp.name === modulePage
		);
		let currModulePageLanguage = currModulePage?.ModulePageLanguages?.find(
			(mpl) => mpl.LanguageId === currentPage.language?.id
		);
		let returnValue = currModulePageLanguage?.[column];
		if (column === "url" && !returnValue.startsWith("/"))
			returnValue = "/" + returnValue;
		return returnValue;
	}
</script>
