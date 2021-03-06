import {Element as PolymerElement} from '@polymer/polymer/polymer-element';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class';
import {PaperDialogBehavior} from '@polymer/paper-dialog-behavior/paper-dialog-behavior';
import '@polymer/paper-dialog-behavior/paper-dialog-shared-styles';

import {ReduxMixin} from '../../../../reducer/redux-mixin';

import style from './style.css';
import template from './html.template';

import {deepClone} from '../../../../commons/utils';

class ComponentMenu extends mixinBehaviors([PaperDialogBehavior], ReduxMixin(PolymerElement)) {
  static get template() {
    return `
      <style include="shared-styles">${style}</style>

      ${template}
    `;
  }

  static get is() { return 'component-menu'; }

  static get properties() {
    return {
      scene: Object,
      groups: {
        type: Object,
        statePath: 'component.groupComponents'
      },
      group: {
        type: String,
      },
      components: {
        type: Array,
        computed: 'computeGroup(group)'
      }
    };
  }

  ready () {
    super.ready();

    this.addEventListener('click', this.onTapTypeList.bind(this));
  }

  onTapTypeList (e) {
    var item = e.path[0];

    while (item && !item.hasAttribute('data-type') && item !== document.body)
      item = item.parentNode;

    if(!item || item == document.body)
      return;

    var type = item.getAttribute('data-type')

    if (!type)
      return

    var group = this.groups[this.group].find(function (p) {
      return p.type === type
    })

    if (this.scene && group) {
      var center = this.scene.root.transcoordC2S(200, 200);

      var model = scene.Component.buildSample(group.model.type, group.model)
      this.scene.add(deepClone(model),
        { cx: center.x, cy: center.y });
    }

    this.close()
  }

  computeGroup (group) {
    return this.groups[group]
  }
}

customElements.define(ComponentMenu.is, ComponentMenu);
