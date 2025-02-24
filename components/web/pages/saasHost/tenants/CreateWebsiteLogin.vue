<template>
	<v-card>
		<v-tabs v-model="tab" stacked align-tabs="center">
			<v-tab value="one">
				<v-icon>mdi-account-clock</v-icon>
				Rychlá registrace
			</v-tab>
			<v-tab value="two">
				<v-icon>mdi-account-plus</v-icon>
				Úplná registrace
			</v-tab>
			<v-tab value="three">
				<v-icon>mdi-account-arrow-left</v-icon>
				Přihlásit se
			</v-tab>
		</v-tabs>

		<v-card-text>
			<v-tabs-window v-model="tab">
				<v-tabs-window-item value="one">
					<WebContentUser
						:headline="'Rychlá registrace'"
						type="register"
						user-type="user"
					/>
				</v-tabs-window-item>

				<v-tabs-window-item value="two">
					<WebContentUser
						:headline="'Úplná registrace'"
						type="register"
						user-type="tenant"
					/>
				</v-tabs-window-item>

				<v-tabs-window-item value="three">
					<CustomLogin />
				</v-tabs-window-item>
			</v-tabs-window>
		</v-card-text>
	</v-card>
</template>
<script setup lang="ts">
	const tab = ref("one");
</script>
