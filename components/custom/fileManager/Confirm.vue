<template>
	<v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel">
		<v-card>
			<v-toolbar dark :color="options.color" dense flat>
				<v-toolbar-title class="white--text">{{
					title
				}}</v-toolbar-title>
			</v-toolbar>
			<v-card-text
				v-if="message"
				class="pa-4 text-center"
				v-html="message"
			></v-card-text>
			<v-card-actions class="pt-0">
				<v-spacer></v-spacer>
				<v-btn text @click="cancel">Cancel</v-btn>
				<v-btn depressed :color="options.color" @click="agree"
					>Yes</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
	const dialog = ref(false);
	const resolve = ref(null);
	const reject = ref(null);
	const message = ref(null);
	const title = ref(null);
	const options = ref({
		color: "error",
		width: 300,
	});

	const open = (titleValue, messageValue, optionsValue) => {
		dialog.value = true;
		title.value = titleValue;
		message.value = messageValue;
		options.value = Object.assign(options.value, optionsValue);
		return new Promise((resolveValue, rejectValue) => {
			resolve.value = resolveValue;
			reject.value = rejectValue;
		});
	};

	const agree = () => {
		resolve.value(true);
		dialog.value = false;
	};

	const cancel = () => {
		resolve.value(false);
		dialog.value = false;
	};
</script>
