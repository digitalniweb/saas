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
			<v-tooltip text="Register" location="bottom">
				<template v-slot:activator="{ props }">
					<v-btn
						icon="mdi-account-plus"
						v-bind="props"
						to="/register"
					></v-btn>
				</template>
			</v-tooltip>
			<v-tooltip text="Login" location="bottom">
				<template v-slot:activator="{ props }">
					<v-btn
						icon="mdi-account-arrow-left"
						v-bind="props"
						to="/login"
					></v-btn>
				</template>
			</v-tooltip>
			<v-tooltip text="Logout" location="bottom">
				<template v-slot:activator="{ props }">
					<v-btn
						icon="mdi-account-arrow-right"
						v-bind="props"
						to="/logout"
					></v-btn>
				</template>
			</v-tooltip>

			<v-tooltip text="Profile" location="bottom">
				<template v-slot:activator="{ props }">
					<v-btn
						icon="mdi-account"
						v-bind="props"
						to="/profile"
					></v-btn>
				</template>
			</v-tooltip>
		</template>
	</v-app-bar>
</template>
<script setup>
	import { useMenusStore } from "@/store/menus";
	import { storeToRefs } from "pinia";
	const { articles: menu } = storeToRefs(useMenusStore());
	const appBar = ref();
</script>
