import Vue from 'vue'
export default () => {
  Vue.directive('Int', {
    inserted: function(el) {
      el.addEventListener('keypress', function(e) {
        e = e || window.event
        const charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode
        const re = /\d/
        if (el.value && el.value.length === 0 && charcode === 48) {
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            e.returnValue = false
          }
        } else {
          if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
            if (e.preventDefault) {
              e.preventDefault()
            } else {
              e.returnValue = false
            }
          }
        }
      })
    }
  })
}
