guard 'coffeescript', input: 'javascripts', output: 'public/javascripts', bare: true

guard 'sass',
  input: 'stylesheets',
  output: 'public/stylesheets',
  load_paths: ['stylesheets/partials']

guard('slim', input_root: 'templates', output_root: 'public', slim: { pretty: true }) do
  watch(%r'^.+\.slim$')
end
