<template>
	<v-app-bar ref="appBar" class="px-5" rounded flat>
		<nuxt-link variant="plain" to="/">
			<v-avatar
				:image="webinformationLocale('logo')"
				tile
				start
				size="80"
			>
				<img
					src="/img/logo.webp"
					:alt="webInformationStore.data.name"
					width="100%"
				/>
			</v-avatar>
		</nuxt-link>
		<WebMenuList :levelitems="menu" ulid="navitems" />
		<template v-slot:append>
			<!-- We don't check if user is logged on server - then there is a missmatch so we need to check wether the component was mounted; if everything is loaded -->
			<div v-if="hasUsers">
				<div v-if="loadingClient || !userStore.logged">
					<v-tooltip
						:text="modulesLocale('users', 'Register', 'name')"
						location="bottom"
					>
						<template v-slot:activator="{ props }">
							<v-btn
								:aria-label="
									modulesLocale('users', 'Register', 'name')
								"
								icon="mdi-account-plus"
								v-bind="props"
								:to="modulesLocale('users', 'Register', 'url')"
							/>
						</template>
					</v-tooltip>
					<v-tooltip
						location="bottom"
						:text="modulesLocale('users', 'Login', 'name')"
					>
						<template v-slot:activator="{ props }">
							<v-btn
								:aria-label="
									modulesLocale('users', 'Login', 'name')
								"
								icon="mdi-account-arrow-left"
								v-bind="props"
								:to="modulesLocale('users', 'Login', 'url')"
							/>
						</template>
					</v-tooltip>
				</div>
				<div v-else>
					<v-tooltip
						:text="modulesLocale('users', 'Logout', 'name')"
						location="bottom"
					>
						<template v-slot:activator="{ props }">
							<v-btn
								:aria-label="
									modulesLocale('users', 'Logout', 'name')
								"
								icon="mdi-account-arrow-right"
								v-bind="props"
								:to="modulesLocale('users', 'Logout', 'url')"
							/>
						</template>
					</v-tooltip>

					<v-tooltip
						:text="modulesLocale('users', 'Profile', 'name')"
						location="bottom"
						v-if="userStore.role === 'user'"
					>
						<template v-slot:activator="{ props }">
							<v-btn
								:aria-label="
									modulesLocale('users', 'Profile', 'name')
								"
								icon="mdi-account"
								v-bind="props"
								:to="modulesLocale('users', 'Profile', 'url')"
							/>
						</template>
					</v-tooltip>
					<!-- add to globalData modules with languages -->
					<v-tooltip
						text="admin"
						location="bottom"
						v-if="userStore.role === 'admin'"
					>
						<template v-slot:activator="{ props }">
							<v-btn
								aria-label="admin"
								icon="mdi-account-cog"
								v-bind="props"
								to="/admin"
							/>
						</template>
					</v-tooltip>
				</div>
			</div>
			<!-- <v-tooltip
				text="Error test dev"
				location="bottom"
				v-if="config.public.environment === 'development'"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						icon="mdi-alert-box"
						to="/nonExistingPage"
						v-bind="props"
					/>
				</template>
			</v-tooltip> -->
			<CustomThemeToggle />
			<v-tooltip
				:text="
					modulesLocale('saasHost', `Create tenant's website`, 'name')
				"
				location="bottom"
				v-if="modulesStore.hasWebsiteModule('saasHost')"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						:aria-label="
							modulesLocale(
								'saasHost',
								`Create tenant's website`,
								'name'
							)
						"
						:to="
							modulesLocale(
								'saasHost',
								`Create tenant's website`,
								'url'
							)
						"
						icon="mdi-plus"
						class="cursor-pointer"
						variant="flat"
						color="green-darken-2"
						size="small"
						v-bind="props"
					></v-btn>
				</template>
			</v-tooltip>
		</template>
	</v-app-bar>
</template>
<script setup lang="ts">
	import { useLocales } from "../../../composables/useLocales";
	import { useMenusStore } from "@/store/menus";
	import { useModulesStore } from "@/store/modules";
	import { useUserStore } from "../../../store/user";
	import { useWebInformationStore } from "../../../store/webInformation";
	import { storeToRefs } from "pinia";

	const config = useRuntimeConfig();

	const { webinformationLocale, modulesLocale } = useLocales();

	const { articles: menu } = storeToRefs(useMenusStore());
	const appBar = ref();

	const userStore = useUserStore();

	const webInformationStore = useWebInformationStore();

	const loadingClient = ref(true);
	onMounted(() => {
		loadingClient.value = false;
	});

	const modulesStore = useModulesStore();
	const hasUsers = computed(() =>
		modulesStore.hasSomeWebsiteModules(["users"])
	);
</script>
