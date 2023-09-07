<template>
	<ul :class="ulclass" :id="ulid">
		<li v-for="(item, id) in levelitems" :key="id">
			<v-btn :to="item.url" nuxt>
				<v-icon v-if="item.icon" class="mr-2">
					mdi-{{ item.icon }}
				</v-icon>
				{{ item.name }}
				<v-icon v-if="item.children" class="ml-2">
					mdi-chevron-down
				</v-icon>
			</v-btn>
			<MenuList :levelitems="item.children" />
		</li>
	</ul>
</template>

<script>
	export default {
		name: "MenuList",
		components: {},
		data: function () {
			return {
				// buttons: this.buttonsProps || {}, // need to do this because of SSR (otherwise submenus aren't rendered) - this would be ok If I didn't need reactivity. Need to do this a computed property
			};
		},
		props: {
			ulclass: String,
			ulid: String,
			levelitems: Array,
			buttonsProps: Object,
		},
		computed: {
			buttons: function () {
				// need to do this because of reactivity and SSR (otherwise submenus aren't rendered and reactivity in admin when adjusting menu options doesn't work)
				return this.buttonsProps || {};
			},
		},
	};
</script>
