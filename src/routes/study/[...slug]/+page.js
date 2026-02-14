export async function load({ data }) {
    const { post } = data;

    const components = {};

    for (const module of post.content) {
        if (module.type != 'chat1' && module.type != 'chat2' && module.type != 'quiz') {
            components[module.type] = (await import(`../../../lib/components/classmodule/${module.type}.svelte`)).default;

        }
    }

    return {
        post,
        components
    };
}
