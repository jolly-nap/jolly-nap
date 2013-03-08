guard 'coffeescript', input: 'src/javascripts', output: 'javascripts', bare: true

guard 'sass',
  input: 'src/stylesheets',
  output: 'stylesheets',
  load_paths: ['src/stylesheets/partials']

guard('slim', input_root: 'src/templates', output_root: './', slim: { pretty: true }) do
  watch(%r'^.+\.slim$')
end
