import {
  Center,
  Button,
  Text,
  Image,
  VStack,
  InputGroup,
  Input,
  InputRightElement,
  Icon,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { TbCheck, TbCopy, TbExternalLink, TbFilePlus } from "react-icons/tb";
import QrCode from "qrcode-reader";

const qr = new QrCode();

export default function Home() {
  const toast = useToast({
    position: "top-right",
    duration: 2000,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageDataURL, setImageDataURL] = useState("");
  const [qrString, setQrString] = useState("");
  const { onCopy, setValue, hasCopied } = useClipboard("");
  const isUrl = /https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/.test(qrString);

  useEffect(() => {
    console.log("image loaded");
    if (!imageDataURL) return;
    qr.callback = (err: Error, value: { result: string; point: any }) => {
      if (err) {
        setQrString("QRコードを読み取れませんでした");
        return;
      }
      console.log("Detected QR code", value);
      setQrString(value.result);
      setValue(value.result);
    };
    qr.decode(imageDataURL);
  }, [imageDataURL]);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Center minH={[["100vh", "100dvh"]]} flex={1} p={4}>
      <VStack flex={1} spacing={12}>
        <Button
          onClick={() => inputRef.current?.click()}
          leftIcon={<TbFilePlus />}
        >
          画像読み込み
        </Button>
        {imageDataURL ? (
          <VStack spacing={12} minW={40}>
            <Image src={imageDataURL} rounded="lg" shadow="lg" />
            <InputGroup
              size="lg"
              onClick={() => {
                onCopy();
                toast({
                  variant: "subtle",
                  status: "success",
                  title: "コピーしました。",
                });
              }}
              colorScheme={hasCopied ? "green" : "gray"}
            >
              <Input
                value={qrString}
                isReadOnly
                colorScheme={hasCopied ? "green" : "gray"}
                _hover={{ cursor: "pointer" }}
                onClick={() => {
                  if (isUrl) window.open(qrString);
                }}
              />
              <InputRightElement>
                {hasCopied ? (
                  <Icon as={TbCheck} color="green" />
                ) : isUrl ? (
                  <Icon as={TbExternalLink} />
                ) : (
                  <Icon as={TbCopy} />
                )}
              </InputRightElement>
            </InputGroup>
          </VStack>
        ) : (
          <Center h={20}>
            <Text fontWeight="bold">QRコード画像を読み込ませてください。</Text>
          </Center>
        )}
        <input
          hidden
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (!e.target.files) return;
            const reader = new FileReader();
            reader.onload = () => {
              setImageDataURL(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
          }}
        />
      </VStack>
    </Center>
  );
}
