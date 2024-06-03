<template>
	<v-app-bar ref="appBar" class="px-5" rounded flat>
		<template v-slot:prepend v-if="false">
			<nuxt-link variant="plain" to="/">
				<v-avatar
					:image="webinformationLocale('logo')"
					tile
					start
					size="80"
					aria-label="add WebinformationLanguage name, maybe add it to currentPage"
				/>
			</nuxt-link>
		</template>
		<nuxt-link variant="plain" to="/">
			<v-avatar
				:image="webinformationLocale('logo')"
				tile
				start
				size="80"
			/>
		</nuxt-link>
		<WebMenuList :levelitems="menu" :ulid="'navitems'" />
		<template v-slot:append>
			<v-tooltip
				:text="modulesLocale('users', 'Register', 'name')"
				location="bottom"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						:aria-label="modulesLocale('users', 'Register', 'name')"
						icon="mdi-account-plus"
						v-bind="props"
						:to="modulesLocale('users', 'Register', 'url')"
					></v-btn>
				</template>
			</v-tooltip>
			<v-tooltip
				location="bottom"
				:text="modulesLocale('users', 'Login', 'name')"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						:aria-label="modulesLocale('users', 'Login', 'name')"
						icon="mdi-account-arrow-left"
						v-bind="props"
						:to="modulesLocale('users', 'Login', 'url')"
					></v-btn>
				</template>
			</v-tooltip>
			<v-tooltip
				:text="modulesLocale('users', 'Logout', 'name')"
				location="bottom"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						:aria-label="modulesLocale('users', 'Logout', 'name')"
						icon="mdi-account-arrow-right"
						v-bind="props"
						:to="modulesLocale('users', 'Logout', 'url')"
					></v-btn>
				</template>
			</v-tooltip>

			<v-tooltip
				:text="modulesLocale('users', 'Profile', 'name')"
				location="bottom"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						:aria-label="modulesLocale('users', 'Profile', 'name')"
						icon="mdi-account"
						v-bind="props"
						:to="modulesLocale('users', 'Profile', 'url')"
					></v-btn>
				</template>
			</v-tooltip>
		</template>
	</v-app-bar>
</template>
<script setup lang="ts">
	import { useLocales } from "../../../composables/useLocales";
	import { useMenusStore } from "@/store/menus";
	import { storeToRefs } from "pinia";

	const { webinformationLocale, modulesLocale } = useLocales();

	const { articles: menu } = storeToRefs(useMenusStore());
	const appBar = ref();
</script>
