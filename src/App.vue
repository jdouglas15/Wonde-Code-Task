<template>
  <router-view></router-view>
  <div>
    <h1 class="title is-1">Wonde Task</h1>
  </div>
    <div class="field">
      <label class="label">Hide Staff with no classes:</label>
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" 
            v-model="hideNoClasses" 
          />
          <span class="check"></span>
        </label>
      </div>
    </div>
  <div 
    class="section"
    v-if="!showViewClassesModal"
    >
    <div class="container">
      <table class="table is-fullwidth">
        <caption>Teacher Data</caption>
        <thead>
          <tr>
            <th>Title</th>
            <th>Legal Surname</th>
            <th>Legal Forename</th>
            <th>Has Classes</th>
            <th>View Classes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedEmployeeData" :key="index">
            <td>{{ item.title }}</td>
            <td>{{ item.legal_surname }}</td>
            <td>{{ item.legal_forename }}</td>
            <td>{{ item.hasClasses }}</td>
            <td> <button class="button is-info" @click="viewClasses(item)" :disabled="item.hasClasses === 'No'">View</button></td>
          </tr>
        </tbody>
      </table>

      <nav class="pagination is-centered" role="navigation" aria-label="pagination">
        <a class="pagination-previous" @click="currentPage > 1 ? prevPage : null" :class="{ 'disabled-link': currentPage === 1 }">Previous</a>
        <a class="pagination-next" @click="nextPage">Next</a>
        <ul class="pagination-list">
          <li v-for="page in pageCount" :key="page">
            <a class="pagination-link" @click="gotoPage(page)" :class="{ 'is-current': page === currentPage }">{{ page }}</a>
          </li>
        </ul>
      </nav>
    </div>
    <div>
      <button
        v-if="!showClassList"
        class="button is-primary"
        @click="showClassList = true"
        :class="{ 'is-success': showClassList }"
      >
        Show Class List
      </button>
  </div>
  </div>
  <class-list
    v-if="showClassList"
    >
  </class-list>
  <view-classes
    v-if="showViewClassesModal"
    :staffObj="staffObj"
    >
  </view-classes>
</template>

<script>
import ClassList from './components/ClassList.vue';
import ViewClasses from './components/ViewClasses.vue';

export default {
  components: {
    'class-list': ClassList,
    'view-classes': ViewClasses
  },
  data() {
    return {
      employeeData: [],
      currentPage: 1,
      itemsPerPage: 10,
      pageCount: 0,
      showClassList: false,
      showViewClassesModal: false,
      hideNoClasses: false
    };
  },
  methods: {
    fetchData() {
      const url = "https://api.wonde.com/v1.0/schools/A1930499544/employees?include=classes";
      const headers = {
        Authorization: "b594413a99c7f566718c8d200989933b128eb791",
      };

      this.employeeData = [];

      fetch(url, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.data)) {
            this.employeeData = data.data;

            // Check if the 'Classes' array is empty
            this.employeeData.forEach((item) => {
              item.hasClasses = item.classes.data.length > 0 ? "Yes" : "No";
              });
          } else {
            console.error("API Error");
          }
        })
        .catch((error) => {
          console.error(error);
        });
  },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
      console.log("currentPage:", this.currentPage); // Add this line for debugging
    },
    nextPage() {
      if (this.currentPage * this.itemsPerPage < this.employeeData.length) {
        this.currentPage++;
      }
    },
    viewClasses(item) {
      this.showViewClassesModal = true
      this.staffObj = item;
    }
  },
  computed: {
    paginatedEmployeeData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredEmployeeData.slice(start, end);
    },
    filteredEmployeeData() {
      return this.hideNoClasses
        ? this.employeeData.filter((item) => item.hasClasses === 'Yes')
        : this.employeeData;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style>
@import 'bulma/css/bulma.min.css';

.disabled-link {
  pointer-events: none; /* Prevent click events */
  color: #ccc; /* Change the color to gray or your desired disabled color */
}
</style>
