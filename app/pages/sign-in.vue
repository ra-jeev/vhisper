<template>
  <UCard class="max-w-sm w-full">
    <h2 class="text-2xl font-medium text-center">Sign in to your account</h2>

    <UForm
      ref="form"
      :schema="signInSchema"
      :state="state"
      class="space-y-4 my-6"
      @submit="onSignIn"
    >
      <UFormField name="username" label="Username" required>
        <UInput
          v-model.trim="state.username"
          placeholder="Enter you username"
          icon="i-lucide-at-sign"
        />
      </UFormField>

      <UFormField name="password" label="Password" required>
        <UInput
          v-model.trim="state.password"
          class="w-full"
          icon="i-lucide-key-round"
          placeholder="Enter your password"
          :type="showPassword ? 'text' : 'password'"
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              aria-controls="password"
              color="neutral"
              variant="link"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              :icon="showPassword ? `i-lucide-eye-off` : `i-lucide-eye`"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UButton
        block
        class="mt-2"
        trailing-icon="i-lucide-arrow-right"
        type="submit"
        :loading="loading"
        :disabled="loading"
        :ui="{ trailingIcon: 'ms-0' }"
      >
        Continue
      </UButton>
    </UForm>

    <div
      class="text-sm font-medium text-gray-600 dark:text-gray-300 text-center"
    >
      Don't have an account?
      <ULink
        class="text-[var(--ui-primary)] hover:text-[var(--ui-primary)]/75"
        to="/sign-up"
      >
        Create one now
      </ULink>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { FetchError } from "ofetch";
import { signInSchema } from "#shared/schemas/auth.schema";
import type { Form, FormSubmitEvent } from "#ui/types";

const showPassword = ref(false);
const loading = ref(false);
const form = useTemplateRef<Form<SignInSchemaType>>("form");

const state = reactive<Partial<SignInSchemaType>>({
  username: undefined,
  password: undefined,
});

const toast = useToast();
const { fetch: refreshSession } = useUserSession();
const onSignIn = async (event: FormSubmitEvent<SignInSchemaType>) => {
  loading.value = true;
  form.value?.clear();

  try {
    await $fetch("/api/auth/sign-in", {
      method: "POST",
      body: {
        username: event.data.username,
        password: event.data.password,
      },
    });

    toast.add({
      title: "Success",
      description: "Sign in successful.",
      color: "success",
    });

    await refreshSession();
  } catch (error) {
    let errorMsg = "Failed to sign in. Please try again later.";
    if (error instanceof FetchError && error.data?.statusMessage) {
      errorMsg = error.data.statusMessage;
    }

    toast.add({
      title: "Error",
      description: errorMsg,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

definePageMeta({
  layout: "auth",
});
</script>
