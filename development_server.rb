#!/usr/bin/env ruby
require 'webrick'
server = WEBrick::HTTPServer.new(Port: 3000, DocumentRoot: Dir.pwd)

trap 'INT' do
  server.shutdown
end

server.start