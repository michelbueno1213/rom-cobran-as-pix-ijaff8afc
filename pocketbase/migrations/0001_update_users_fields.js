migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!users.fields.getByName('is_admin')) {
      users.fields.add(new BoolField({ name: 'is_admin' }))
    }

    if (!users.fields.getByName('telefone')) {
      users.fields.add(new TextField({ name: 'telefone' }))
    }

    if (!users.fields.getByName('cnpj')) {
      users.fields.add(new TextField({ name: 'cnpj' }))
    }

    // Regra de update protegendo is_admin contra alteração pelo próprio usuário comum
    // Apenas admins ou updates que não alterem is_admin são permitidos
    users.updateRule = 'id = @request.auth.id && @request.body.is_admin:changed = false'

    app.save(users)

    // Se já existirem usuários, o mais antigo vira admin
    try {
      const oldest = app.findRecordsByFilter('_pb_users_auth_', '', 'created', 1, 0)
      if (oldest && oldest.length > 0) {
        oldest[0].set('is_admin', true)
        app.save(oldest[0])
      }
    } catch (err) {
      console.log('Nenhum usuário antigo para atualizar admin:', err)
    }
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const fAdmin = users.fields.getByName('is_admin')
    if (fAdmin) users.fields.removeByName('is_admin')
    const fTel = users.fields.getByName('telefone')
    if (fTel) users.fields.removeByName('telefone')
    const fCnpj = users.fields.getByName('cnpj')
    if (fCnpj) users.fields.removeByName('cnpj')
    users.updateRule = 'id = @request.auth.id'
    app.save(users)
  },
)
