function deleteChar(id){
    $.ajax({
        url: '/characters/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteCharSpell(pid, cid){
  $.ajax({
      url: '/spells/charspells/pid/' + pid + '/cid/' + cid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};