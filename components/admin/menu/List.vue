<template>test</template>

<script>
	export default {
		name: "AdminMenuList",
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
