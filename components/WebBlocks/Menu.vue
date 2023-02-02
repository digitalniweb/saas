<template>
	<v-app-bar>
		<MenuList :levelitems="items" :ulid="'navitems'" />
	</v-app-bar>
</template>
<script setup>
	const items = [
		{
			url: "/",
			name: "home",
			children: [
				{
					name: "subhome",
					url: "/",
				},
			],
		},
	];
</script>
