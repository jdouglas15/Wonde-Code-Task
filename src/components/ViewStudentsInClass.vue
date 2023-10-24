<template>
    <div>
      <hr>
      <p class="title is-4">Students in {{ ClassName }}</p>
      <table class="table is-fullwidth" v-if="ClassObj.length > 0">
        <thead>
          <tr>
            <th>Count</th>
            <th>Surname</th>
            <th>Forename</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in ClassObj[0].students.data" :key="student.id">
            <td>{{ index + 1 }}</td>
            <td>{{ student.surname }}</td>
            <td>{{ student.forename }}</td>
            <td>{{ student.id }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        Loading data...
      </div>
    </div>
  </template>
<script>
  export default {
    props: {
      ClassName: {
      type: String, 
    },
  },
  data() {
    return {
    ClassObj: [],
    };
  },
  mounted() {
    this.fetchStudentsInClass();
  },
  methods: {
    fetchStudentsInClass() {
        const url = `https://api.wonde.com/v1.0/schools/A1930499544/classes?include=students&subject&class_name=${encodeURIComponent(this.ClassName)}`;        
        const headers = {
          Authorization: "b594413a99c7f566718c8d200989933b128eb791",
        };
  
        this.ClassObj = [];
  
        fetch(url, {
          method: "GET",
          headers: headers,
        })
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data.data)) {
              this.ClassObj = data.data;
            } else {
              console.error("API response does not contain an array in the 'data' property.");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      },
  },
}
</script>

<style>
@import '~bulma/css/bulma.min.css';
</style>