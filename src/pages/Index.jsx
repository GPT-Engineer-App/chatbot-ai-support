import { useState } from "react";
import { Container, VStack, Input, Button, Text, Box, HStack, IconButton, useToast } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const toast = useToast();

  const sendMessage = async () => {
    if (!input.trim()) {
      toast({
        title: "Message cannot be empty.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 1000,
          temperature: 0.0,
          system: "Respond only in Yoda-speak.",
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();
      const aiMessage = { role: "ai", content: data.content };
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      toast({
        title: "Error sending message.",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Box width="100%" height="60vh" overflowY="auto" borderWidth="1px" borderRadius="lg" padding={4}>
          {messages.map((msg, index) => (
            <Box key={index} alignSelf={msg.role === "user" ? "flex-end" : "flex-start"} bg={msg.role === "user" ? "blue.100" : "green.100"} borderRadius="md" padding={2} marginY={1}>
              <Text>{msg.content}</Text>
            </Box>
          ))}
        </Box>
        <HStack width="100%">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
          <IconButton aria-label="Send" icon={<FaPaperPlane />} onClick={sendMessage} />
        </HStack>
      </VStack>
    </Container>
  );
};

export default Index;
