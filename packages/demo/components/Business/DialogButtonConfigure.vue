<template>
  <v-card>
    <v-card-text>
      <v-switch dense :color="hGlobalThemeColor" v-model="value.isShow" :label="switchLabel"></v-switch>
    </v-card-text>
    <v-expand-transition>
      <div v-show="value.isShow">
        <v-divider></v-divider>
        <v-container>
          <v-list dense>
            <v-list-item class="px-2">
              <v-list-item-content>
                <v-list-item-subtitle>text: `{{value.txt}}`</v-list-item-subtitle>
                <v-list-item-subtitle>
                  color: {{value.color}}
                  <div :style="colorBlockStyle" :class="['color-block', colorBlockClass]"></div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-menu
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-x
                  left
                  :nudge-top="50"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon dense>mdi-cog</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-list>
                      <v-list-item>
                        <v-text-field
                          :color="hGlobalThemeColor"
                          :disabled="!value.isShow"
                          v-model="value.txt"
                          label="text"
                        ></v-text-field>
                      </v-list-item>
                      <v-list-item>
                        <ColorSelectBundle v-model="value.color"></ColorSelectBundle>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-container>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import ColorSelectBundle from "../Common/Color/ColorSelectBundle";
export default {
  components: { ColorSelectBundle },
  props: {
    buttonType: {
      type: String,
      require: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    switchLabel() {
      return `${this.value.isShow ? "show" : "hide"} ${this.buttonType} button`;
    },
    colorItems() {
      return this.$store.state.colorItems;
    },
    colorBlockStyle() {
      return { [`background-color`]: this.value.color };
    },
    colorBlockClass() {
      return {
        [`${this.value.color}`]: true
      };
    }
  }
};
</script>

<style scoped>
.color-block {
  margin-left: 1px;
  height: 10px;
  width: 10px;
  display: inline-block;
}
</style>