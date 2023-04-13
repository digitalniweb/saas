<template>
	<v-app-bar>
		<MenuTop :items="menu" />
	</v-app-bar>
</template>
<script setup>
	const menu = ref([
		{
			url: "/",
			name: "home",
		},
		{
			url: "/",
			name: "submenus",
			children: [
				{
					name: "submenu",
					url: "/",
					children: [
						{
							name: "test",
							url: "/",
						},
					],
				},
				{
					name: "submenu nested",
					url: "/",
					children: [
						{
							name: "nested",
							url: "/",
						},
					],
				},
			],
		},
	]);
</script>
