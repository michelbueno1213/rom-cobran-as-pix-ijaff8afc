// Hook para garantir que o primeiro usuário registrado no sistema seja administrador
onRecordCreate((e) => {
  e.next()

  try {
    const totalUsers = $app.countRecords('users')
    if (totalUsers === 1) {
      // É o primeiro usuário registrado
      e.record.set('is_admin', true)
      $app.save(e.record)
    }
  } catch (err) {
    console.log('Erro ao definir admin no primeiro usuario:', err)
  }
}, 'users')
