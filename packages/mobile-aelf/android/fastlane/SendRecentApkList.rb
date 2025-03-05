require 'aws-sdk-s3'
require 'dotenv/load'
require 'net/http'
require 'uri'
require 'json'

def list_recent_files(s3_client, bucket_name, directory, n)
  response = s3_client.list_objects_v2(
    bucket: bucket_name,
    prefix: directory
  )

  files = response.contents.sort_by(&:last_modified).reverse.take(n)

  files.each do |object|
    puts "Name: #{object.key}"
    puts "Last Modified: #{object.last_modified}"
    puts "Size: #{object.size} bytes"
    puts "ETag: #{object.etag}"
    puts "-------------------------"
  end

  files
end

def send_lark_notification22()
  lark_message = {
    "msg_type" => "post",
    "content" => {
      "post" => {
        "en_us" => {
          # "title" => "#{title} 🚀",
          "content" => [
            [
              { "tag" => "text", "text" => "test (ignore this message) " },
            ]
          ]
        }
      }
    }
  }

  lark_webhook_url = ENV['LARK_WEBHOOK_URL'] || "https://open.larksuite.com/open-apis/bot/v2/hook/7ff82584-0b49-4d63-bd8a-81449b77c38f"
  unless lark_webhook_url
    UI.user_error!("LARK_WEBHOOK_URL is not set!")
  end

  uri = URI.parse(lark_webhook_url)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  # UI.message("Lark webhook URL: #{lark_webhook_url}")
  # UI.message("Parsed URI path: #{uri.path}")
  request = Net::HTTP::Post.new(uri.path, { 'Content-Type' => 'application/json' })
  request.body = lark_message.to_json
  response = http.request(request)
  puts "Response code: #{response.code}"
  puts "Response body: #{response.body}"
  if response.code.to_i >= 200 && response.code.to_i < 300
    # UI.success("Lark notification sent successfully! 🚀")
  else
    # UI.error("Failed to send Lark notification: #{response.code} - #{response.body}")
  end
end

def send_lark_notification(title, files, bucket_name, region)
  lark_message = {
    "msg_type" => "post",
    "content" => {
      "post" => {
        "en_us" => {
          "title" => title,
          "content" => [ files.map do |file|
            size_in_mb = (file.size.to_f / (1024 * 1024)).round(2)
            [
              { "tag" => "text", "text" => "Name: #{file.key}\nLast Modified: #{file.last_modified}\nSize: #{size_in_mb} MB\nETag: #{file.etag}\n" },
              { "tag" => "a", "text" => "Click here to download", "href" => "https://#{bucket_name}.s3.#{region}.amazonaws.com/#{file.key}" },
              { "tag" => "text", "text" => "\n================================================================\n" }
            ]
          end.flatten
          ]
        }
      }
    }
  }
  lark_webhook_url = ENV['LARK_WEBHOOK_URL'] || "https://open.larksuite.com/open-apis/bot/v2/hook/7ff82584-0b49-4d63-bd8a-81449b77c38f"
  unless lark_webhook_url
    UI.user_error!("LARK_WEBHOOK_URL is not set!")
  end

  uri = URI.parse(lark_webhook_url)
  

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  request = Net::HTTP::Post.new(uri.path, { 'Content-Type' => 'application/json' })
  request.body = lark_message.to_json
  puts "lark_message.to_json :#{lark_message.to_json}"
  response = http.request(request)

  puts "Response code: #{response.code}"
  puts "Response body: #{response.body}"
  if response.code.to_i >= 200 && response.code.to_i < 300
    puts "Lark notification sent successfully! 🚀"
  else
    puts "Failed to send Lark notification: #{response.code} - #{response.body}"
  end
end

s3_key = ENV['EOA_APK_S3_KEY']
s3_secret = ENV['EOA_APK_S3_SECRET']
bucket_name = 'portkey-eoa-cms-testnet'
region = 'ap-northeast-1'
directory = 'eoa-apk/'
n = ENV['RECENT_FILES_COUNT'].to_i

puts "Initializing S3 client with access key: #{s3_key}"
s3_client = Aws::S3::Client.new(
  access_key_id: s3_key,
  secret_access_key: s3_secret,
  region: region
)
puts "S3 client initialized."

begin
  recent_files = list_recent_files(s3_client, bucket_name, directory, n)

  send_lark_notification("The Last #{n} APK Files", recent_files, bucket_name, region)
rescue Aws::S3::Errors::AccessDenied => e
  puts "Access Denied: #{e.message}"
rescue Aws::S3::Errors::ServiceError => e
  puts "Service Error: #{e.message}"
end



# send_lark_notification22()