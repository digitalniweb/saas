<template>
	<v-app id="admin">
		<v-navigation-drawer v-model="drawer">
			<v-list class="text-left" v-model:opened="open">
				<client-only>
					<v-list-item
						prepend-avatar="/img/logo.webp"
						title="nickname"
						subtitle="Admin"
					>
					</v-list-item>
					<AdminBlocksMenu />
				</client-only>
			</v-list>
		</v-navigation-drawer>

		<v-main>
			<v-container fluid>
				<v-row class="border-b-sm">
					<v-col cols="2">
						<v-app-bar-nav-icon
							@click="drawer = !drawer"
						></v-app-bar-nav-icon>
					</v-col>
					<v-col class="text-right">
						<CustomThemeToggle />
						<v-skeleton-loader
							v-if="loadingClient"
							type="list-item"
							width="100"
							class="d-inline-flex"
						/>
						<client-only>
							<v-menu>
								<template v-slot:activator="{ props }">
									<v-btn
										class="cursor-pointer mx-1"
										size="small"
										icon="mdi-bell-outline"
										v-bind="props"
										flat
									/>
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
									/>
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
						</client-only>
					</v-col>
				</v-row>
				<v-row v-if="loadingClient"
					><v-col md="6">
						<v-skeleton-loader type="list-item" width="200px" />
						<v-skeleton-loader type="list-item-three-line" />
					</v-col>
					<v-col md="6">
						<v-skeleton-loader type="list-item" width="180px" />
						<v-skeleton-loader type="list-item-three-line" />
					</v-col>
					<v-col cols="12">
						<v-skeleton-loader type="list-item" width="250px" />
						<v-skeleton-loader type="list-item-three-line" /></v-col
				></v-row>
				<v-row>
					<v-col>
						<client-only>
							<slot />
						</client-only>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
</template>

<script setup>
	const drawer = ref(null);
	const open = ref([]);

	const notificationItems = ref([]);

	const loadingClient = ref(true);
	onMounted(() => {
		loadingClient.value = false;
	});

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
