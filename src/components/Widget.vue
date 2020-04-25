<template>
  <v-card
    max-width="94%"
    class="mx-auto my-3"
  >

    <v-toolbar
      color="teal lighten-2"
      dark
    >
      <template v-if="!searchInputIsVisible">
        <v-toolbar-title>Новости образования</v-toolbar-title>
        <v-spacer></v-spacer>
      </template>
      <v-text-field
        v-model="searchQuery"
        v-if="searchInputIsVisible"
        @change="handleSearchIconClick"
      />
      <v-btn
        @click="handleSearchIconClick"
        icon
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <v-tabs
      v-model="activeTab"
      color="teal lighten-2"
      center-active
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab"
        @click="switchTab(tab)"
        ripple
      >
        {{ tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item
        v-for="tab in tabs"
        :key="tab"
      >
        <v-card>
          <v-card-text>

            <!-- News list -->
            <v-list
              v-if="!isFetching && !isNoNews(tab) && !isError(tab)"
              ref="list"
              three-line
            >
              <v-list-item
                v-for="article in getListItems(tab)"
                :key="article.url"
                :href="article.url"
                target="_blank"
                class="article"
              >
                <v-list-item-content>
                  <v-list-item-title v-if="article.title">
                    {{ article.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                    v-if="article.source"
                    class="source"
                  >
                    {{ article.source.name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle  v-if="article.description">
                    <i>{{ getPubDateStr(article) }}:</i>
                    {{ article.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- Pagination -->
            <div
              v-if="isPaginated(tab)"
              class="pagination-container"
            >
              <v-divider />
              <v-pagination
                v-model="activePageNum"
                @input="updateCatActivePage(tab)"
                :length="getPaginationLength(tab)"
                :total-visible="5"
                color="teal"
                class="my-4"
              />
            </div>

            <!-- Progress icon -->
            <div
              v-if="isFetching"
              class="processContainer"
            >
              <v-progress-circular
                :width="2"
                color="teal lighten-2"
                class="my-4"
                indeterminate
              />
            </div>

            <!-- No news message -->
            <v-alert
              dense
              v-if="isNoNews(tab)"
              border="left"
              color="teal lighten-3"
              type="info"
            >
              Нет новостей по данной теме
            </v-alert>

            <!-- Error message -->
            <v-alert
              dense
              v-if="isError(tab)"
              border="left"
              type="error"
            >
              Произошла ошибка
            </v-alert>

          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <v-footer
      color="teal lighten-3"
      dark
      paddless
    >
      <v-col
        class="text-center py-0"
        cols="12"
      >
        Создано на базе <a href="https://newsapi.org" target="_blank">News Api</a>
      </v-col>
    </v-footer>
  </v-card>
</template>

<script>
import goTo from 'vuetify/es5/services/goto';
import fetchNews from '../api/api-call-method';
import keywords from '../api/api-keywords';

export default {
  name: 'Widget',

  data: () => ({
    news: {},
    isFetching: '',
    activeTab: '',
    tabs: keywords.getCategoriesNames(),
    paginations: {},
    activePageNum: 1,
    articlesPerPage: 5,
    searchQuery: '',
    searchInputIsVisible: false,
    searchCatName: 'Поиск',
    allNewsCatName: 'Все новости',
  }),

  methods: {
    switchTab(catName) {
      this.fetchCatNews(catName);
      this.switchTabPagination(catName);
      this.searchInputIsVisible = false;
    },

    fetchCatNews(catName) {
      if (this.news[catName]) return;
      this.isFetching = true;

      fetchNews(catName)
        .then((data) => {
          this.news[catName] = data;
          this.filterCatNews(catName);
          this.createNewPaginationItem(catName);
        }).catch((err) => {
          this.news[catName] = { error: err };
        })
        .finally(() => {
          this.isFetching = false;
        });
    },

    filterCatNews(catName) {
      if (!this.news[catName] || !this.news[catName].articles) return '';

      const catNews = this.news[catName].articles;
      const newsSortedByTitle = catNews.slice().sort(this.sortByTitle);
      const newsTitles = newsSortedByTitle.map((item) => item.title);
      const filteredCatNews = newsSortedByTitle
        .filter((item, index) => newsTitles.lastIndexOf(item.title) === index);
      const filteredCatNewsSortedByDate = filteredCatNews.slice().sort(this.sortByDate);
      this.news[catName].articles = filteredCatNewsSortedByDate;

      return filteredCatNewsSortedByDate;
    },

    sortByTitle(a, b) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    },

    sortByDate(a, b) {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    },

    createNewPaginationItem(catName) {
      const catNews = this.news[catName];
      if (catNews.totalResults && catNews.totalResults > this.articlesPerPage) {
        this.paginations[catName] = 1;
      }
    },

    isNoNews(catName) {
      return this.news[catName] ? this.news[catName].totalResults === 0 : false;
    },

    isError(catName) {
      return !!(this.news[catName] && this.news[catName].error);
    },

    getPubDateStr(article) {
      if (!article.publishedAt) return '';
      try {
        const date = new Date(article.publishedAt);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      } catch (err) {
        return '';
      }
    },

    updateCatActivePage(catName) {
      this.paginations[catName] = this.activePageNum;
      goTo(this.$refs.list[0]);
    },

    switchTabPagination(catName) {
      if (this.paginations[catName]) {
        this.activePageNum = this.paginations[catName];
      } else this.activePageNum = 1;
    },

    getListItems(catName) {
      if (!this.news[catName] || !this.news[catName].articles) return '';

      if (this.paginations[catName]) {
        const currentPageNum = this.paginations[catName];
        const startItem = (currentPageNum - 1) * this.articlesPerPage;
        const endItem = startItem + this.articlesPerPage;
        return this.news[catName].articles.slice(startItem, endItem);
      }

      return this.news[catName].articles;
    },

    getPaginationLength(catName) {
      return this.news[catName] && this.news[catName].articles
        ? Math.ceil(this.news[catName].articles.length / this.articlesPerPage) : 0;
    },

    isPaginated(catName) {
      if (!this.news[catName] || !this.news[catName].articles) return false;
      return this.news[catName].articles.length > this.articlesPerPage;
    },

    applySearch() {
      this.removePrevSearchResults();

      keywords.setCategory(
        this.searchCatName,
        this.searchQuery.split(',').map(this.coverInParenthesis),
      );

      // updating the list of tab names with the search tab
      this.tabs = keywords.getCategoriesNames();

      // switching to search tab programmatically
      this.activeTab = this.getCatIndex(this.searchCatName);
      this.switchTab(this.searchCatName);
    },

    // for correct api work multi word search queries need to be covered in parenthesis
    coverInParenthesis(item) {
      const trimmed = item.trim();
      if (trimmed.indexOf(' ') > -1) return `(${trimmed})`;
      return trimmed;
    },

    handleSearchIconClick() {
      if (!this.searchInputIsVisible) this.searchInputIsVisible = true;

      else if (
        this.searchInputIsVisible && this.searchQuery === ''
      ) this.searchInputIsVisible = false;

      else this.applySearch();
    },

    getCatIndex(catName) {
      const catNames = keywords.getCategoriesNames();
      return catNames.indexOf(catName);
    },

    removePrevSearchResults() {
      if (this.news[this.searchCatName]) delete this.news[this.searchCatName];
      if (this.paginations[this.searchCatName]) delete this.paginations[this.searchCatName];
    },
  },

  created() {
    this.fetchCatNews(this.allNewsCatName);
  },
};
</script>

<style lang="stylus" scoped>
  .processContainer
    width 100%;
    text-align center;
  .article
    cursor pointer;
  .source
    color #009688 !important;
</style>
