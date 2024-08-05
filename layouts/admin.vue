<template>
	<client-only>
		<v-app id="admin">
			<v-navigation-drawer v-model="drawer">
				<v-list class="text-left">
					<v-list-item
						prepend-avatar="/img/logo.webp"
						title="nickname"
						subtitle="Admin"
					>
					</v-list-item>
					<AdminBlocksMenu />
				</v-list>
			</v-navigation-drawer>

			<v-main>
				<v-container fluid>
					<v-row class="border-b-sm">
						<v-col>
							<v-app-bar-nav-icon
								@click="drawer = !drawer"
							></v-app-bar-nav-icon>
						</v-col>
						<v-spacer></v-spacer>
						<v-col class="text-right">
							<v-menu>
								<template v-slot:activator="{ props }">
									<v-btn
										class="cursor-pointer mx-1"
										size="small"
										icon="mdi-bell-outline"
										v-bind="props"
										flat
									></v-btn>
								</template>

								<v-list>
									<v-list-item
										v-for="(item, i) in notificationItems"
										:key="i"
									>
										<v-list-item-title>{{
											item.title
										}}</v-list-item-title>
									</v-list-item>
								</v-list>
							</v-menu>
							<v-menu>
								<template v-slot:activator="{ props }">
									<v-avatar
										variant="elevated"
										class="cursor-pointer mx-1"
										size="small"
										icon="mdi-account"
										v-bind="props"
									></v-avatar>
								</template>

								<v-list>
									<v-list-item
										v-for="(item, i) in avatarItems"
										:key="i"
										:prepend-icon="item.icon"
										:to="item.url"
									>
										<v-list-item-title>{{
											item.title
										}}</v-list-item-title>
									</v-list-item>
								</v-list>
							</v-menu>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<slot />
						</v-col>
					</v-row>
				</v-container>
			</v-main>
			<CustomSnackBars /> </v-app
	></client-only>
</template>

<script setup>
	const drawer = ref(null);
	import { useMenusStore } from "@/store/menus";
	let menuStore = useMenusStore();
	menuStore.loadAdminData();

	const notificationItems = ref([]);

	const avatarItems = ref([
		{
			icon: "mdi-home",
			url: "/",
			title: "Zpět na web",
		},
		{
			icon: "mdi-account-arrow-right-outline",
			url: "/logout",
			title: "Odhlásit se",
		},
	]);
</script>
