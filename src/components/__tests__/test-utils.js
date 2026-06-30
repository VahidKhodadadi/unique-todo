import { render } from "@testing-library/vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

const vuetify = createVuetify({
    components,
    directives,
});

const customRender = (component, options = {}) => {
    return render(component, {
        ...options,
        global: {
            plugins: [vuetify, ...(options.global?.plugins || [])],
        },
    });
};

export * from "@testing-library/vue";
export { customRender as render };