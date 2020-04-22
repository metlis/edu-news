import vuetify from 'vuetify';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VTab from 'vuetify/lib/components/VTabs/VTab';
import VAlert from 'vuetify/lib/components/VAlert';
import VTabItem from 'vuetify/lib/components/VTabs/VTabItem';
import VList from 'vuetify/lib/components/VList/VList';
import VListItem from 'vuetify/lib/components/VList/VListItem';
import VPagination from 'vuetify/lib/components/VPagination/VPagination';
import Widget from '../Widget.vue';
import keywords from '../../api/api-keywords';

jest.mock('../../api/api-call-method.js');

describe('Widget.vue', () => {
  const localVue = createLocalVue();
  beforeEach(() => {
    localVue.use(vuetify);
  });

  test('Fetches common news on component creation', async () => {
    expect.assertions(1);
    const wrapper = shallowMount(Widget, {
      localVue,
    });
    await flushPromises();
    expect(wrapper.vm.news['Все новости']).toBe('123');
  });

  test('Hide loader after the news has been fetched', async () => {
    expect.assertions(1);
    const wrapper = shallowMount(Widget, {
      localVue,
    });
    await flushPromises();
    expect(wrapper.find('.processContainer').exists()).toBe(false);
  });

  test('Tabs are rendered', () => {
    const wrapper = shallowMount(Widget, {
      localVue,
    });
    expect(wrapper.findAll(VTab).length).toEqual(keywords.getCategoriesNames().length);
  });

  test('Category news fetch starts on tab click', async () => {
    expect.assertions(1);
    const fetchCatNews = jest.fn();
    const wrapper = shallowMount(Widget, {
      localVue,
      methods: { fetchCatNews },
    });
    const tab = wrapper.find(VTab);
    tab.trigger('click');
    await wrapper.vm.$nextTick();
    expect(fetchCatNews).toHaveBeenCalled();
  });

  test('Alert messages are displayed for errors and empty category tabs', () => {
    const wrapper = shallowMount(Widget, {
      localVue,
      data() {
        return {
          news: {
            'Все новости': { totalResults: 0 },
            'Дошкольное образование': { totalResults: 1 },
            'Средняя школа': { error: true },
          },
        };
      },
    });
    const tabs = wrapper.findAll(VTabItem);
    const firstTab = tabs.at(0);
    const secondTab = tabs.at(1);
    const thirdTab = tabs.at(2);
    expect(firstTab.find(VAlert).attributes('type')).toBe('info');
    expect(firstTab.find(VList).exists()).toBeFalsy();
    expect(secondTab.find(VAlert).exists()).toBeFalsy();
    expect(thirdTab.find(VAlert).attributes('type')).toBe('error');
    expect(thirdTab.find(VList).exists()).toBeFalsy();
  });

  test('A list of articles is rendered', () => {
    const wrapper = shallowMount(Widget, {
      localVue,
      data() {
        return {
          news: {
            'Все новости': { articles: [{}, {}, {}] },
          },
        };
      },
    });
    expect(wrapper.findAll(VListItem).length).toEqual(3);
  });

  test('Pagination is shown if the number of articles is more than 5', () => {
    const array = Array(6);
    array.fill({});
    const wrapper = shallowMount(Widget, {
      localVue,
      data() {
        return {
          news: {
            'Все новости': { articles: array },
          },
        };
      },
    });
    expect(wrapper.find(VPagination).exists()).toBeTruthy();
  });

  test('Pagination is not shown if the number of articles is less than 5', () => {
    const array = Array(3);
    array.fill({});
    const wrapper = shallowMount(Widget, {
      localVue,
      data() {
        return {
          news: {
            'Все новости': { articles: array },
          },
        };
      },
    });
    expect(wrapper.find(VPagination).exists()).toBeFalsy();
  });
});
