migrate(
  (app) => {
    // 1. rom_wallets
    const wallets = new Collection({
      name: 'rom_wallets',
      type: 'base',
      listRule: '@request.auth.id != "" && user_id = @request.auth.id',
      viewRule: '@request.auth.id != "" && user_id = @request.auth.id',
      createRule: '@request.auth.id != "" && user_id = @request.auth.id',
      updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'apelido', type: 'text' },
        { name: 'address', type: 'text', required: true },
        { name: 'is_default', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_wallets_user ON rom_wallets (user_id)'],
    })
    app.save(wallets)

    // 2. rom_charges (Cobranças de produção e gerais)
    // Regra de leitura pública para permitir a tela pública #/pagar/:id, mas criação/edição restrita ao dono
    const charges = new Collection({
      name: 'rom_charges',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.id != "" && user_id = @request.auth.id',
      updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'valor', type: 'number', required: true },
        { name: 'cliente', type: 'text' },
        { name: 'descricao', type: 'text' },
        { name: 'status', type: 'text', required: true },
        { name: 'is_simulated', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_charges_user ON rom_charges (user_id)'],
    })
    app.save(charges)

    // 3. rom_homolog_charges (Cobranças simuladas de teste do módulo Homologação)
    // Leitura pública para a tela #/pagar/:id funcionar no teste, escrita somente pelo usuário dono
    const homologCharges = new Collection({
      name: 'rom_homolog_charges',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.id != "" && user_id = @request.auth.id',
      updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'valor', type: 'number', required: true },
        { name: 'cliente', type: 'text' },
        { name: 'descricao', type: 'text' },
        { name: 'status', type: 'text', required: true },
        { name: 'is_simulated', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_homolog_charges_user ON rom_homolog_charges (user_id)'],
    })
    app.save(homologCharges)

    // 4. rom_withdrawals (Saques)
    const withdrawals = new Collection({
      name: 'rom_withdrawals',
      type: 'base',
      listRule: '@request.auth.id != "" && user_id = @request.auth.id',
      viewRule: '@request.auth.id != "" && user_id = @request.auth.id',
      createRule: '@request.auth.id != "" && user_id = @request.auth.id',
      updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'valor', type: 'number', required: true },
        { name: 'chave_pix', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(withdrawals)

    // 5. rom_links (Links e QR Codes fixos)
    const links = new Collection({
      name: 'rom_links',
      type: 'base',
      listRule: '@request.auth.id != "" && user_id = @request.auth.id',
      viewRule: '@request.auth.id != "" && user_id = @request.auth.id',
      createRule: '@request.auth.id != "" && user_id = @request.auth.id',
      updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'titulo', type: 'text' },
        { name: 'preco', type: 'number' },
        { name: 'tipo', type: 'text' }, // 'link' | 'qr'
        { name: 'tipo_qr', type: 'text' }, // 'estatico' | 'dinamico'
        { name: 'expiracao', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(links)

    // 6. rom_bill_payments (Pagamentos de boletos/contas)
    const billPayments = new Collection({
      name: 'rom_bill_payments',
      type: 'base',
      listRule: '@request.auth.id != "" && user_id = @request.auth.id',
      viewRule: '@request.auth.id != "" && user_id = @request.auth.id',
      createRule: '@request.auth.id != "" && user_id = @request.auth.id',
      updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'codigo_barras', type: 'text' },
        { name: 'valor', type: 'number' },
        { name: 'status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(billPayments)

    // 7. rom_coupons (Cupons de desconto)
    const coupons = new Collection({
      name: 'rom_coupons',
      type: 'base',
      listRule: '@request.auth.id != "" && user_id = @request.auth.id',
      viewRule: '@request.auth.id != "" && user_id = @request.auth.id',
      createRule: '@request.auth.id != "" && user_id = @request.auth.id',
      updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'codigo', type: 'text', required: true },
        { name: 'desconto_pct', type: 'number' },
        { name: 'ativo', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(coupons)
  },
  (app) => {
    const names = [
      'rom_coupons',
      'rom_bill_payments',
      'rom_links',
      'rom_withdrawals',
      'rom_homolog_charges',
      'rom_charges',
      'rom_wallets',
    ]
    for (const name of names) {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
  },
)
