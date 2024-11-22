<template>
  <UCard class="max-w-sm w-full">
    <h2 class="text-2xl font-medium text-center">Create a new account</h2>

    <UForm
      ref="form"
      :schema="signUpSchema"
      :state="state"
      class="space-y-4 my-6"
      @submit="onSignUp"
    >
      <UFormField name="name" label="Name" required>
        <UInput
          v-model.trim="state.name"
          placeholder="Enter your name"
          icon="i-lucide-user"
          class="w-full"
        />
      </UFormField>

      <UFormField name="username" label="Username" required>
        <UInput
          v-model.trim="state.username"
          placeholder="Enter you username"
          icon="i-lucide-at-sign"
          class="w-full"
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
        :disabled="loading"
        :loading="loading"
        :ui="{ trailingIcon: 'ms-0' }"
      >
        Submit
      </UButton>
    </UForm>

    <div
      class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center"
    >
      Already have an account?
      <ULink
        class="text-[var(--ui-primary)] hover:text-[var(--ui-primary)]/75"
        to="/sign-in"
      >
        Sign in here
      </ULink>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { FetchError } from "ofetch";
import { signUpSchema } from "#shared/schemas/auth.schema";
import type { Form, FormSubmitEvent } from "#ui/types";

const showPassword = ref(false);
const loading = ref(false);
const form = useTemplateRef<Form<SignUpSchemaType>>("form");
const state = reactive<Partial<SignUpSchemaType>>({
  name: undefined,
  username: undefined,
  password: undefined,
});

const toast = useToast();
const { fetch: refreshSession } = useUserSession();
const onSignUp = async (event: FormSubmitEvent<SignUpSchemaType>) => {
  loading.value = true;
  form.value?.clear();

  try {
    await $fetch("/api/auth/signup", {
      method: "POST",
      body: {
        name: event.data.name,
        username: event.data.username,
        password: event.data.password,
      },
    });

    toast.add({
      title: "Success",
      description: "Sign up successful.",
      color: "success",
    });

    await refreshSession();
  } catch (error) {
    let errorMsg = "Failed to sign up. Please try again later.";

    if (error instanceof FetchError) {
      if (error.data?.statusCode === 400 && error.data.data?.issues) {
        form.value?.setErrors(
          error.data.data.issues.map(
            (err: { message: string; path: string[] }) => ({
              message: err.message,
              name: err.path[0],
            }),
          ),
        );
      }

      if (error.data?.statusMessage) {
        errorMsg = error.data.statusMessage;
      }
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
